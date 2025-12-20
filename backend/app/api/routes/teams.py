from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service, get_users_service
from app.core.config import settings
from app.models.team import TeamCreate
from pydantic import BaseModel
from appwrite.id import ID
from typing import Optional, List
import asyncio

router = APIRouter()


# Action Models
class TeamAction(BaseModel):
    team_id: str
    user_id: str


class TeamRequestAction(BaseModel):
    team_id: str
    leader_id: str
    target_user_id: str

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    looking_for: Optional[List[str]] = None
    tech_stack: Optional[List[str]] = None
    project_repo: Optional[str] = None
    status: Optional[str] = None


# Helper function to fetch team (reused multiple times)
async def _get_team(team_id: str) -> dict:
    """Fetch team document"""
    db = get_db_service()
    return await asyncio.to_thread(
        db.get_document,
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.COLLECTION_TEAMS,
        document_id=team_id
    )


async def _update_team(team_id: str, data: dict):
    """Update team document"""
    db = get_db_service()
    return await asyncio.to_thread(
        db.update_document,
        database_id=settings.APPWRITE_DATABASE_ID,
        collection_id=settings.COLLECTION_TEAMS,
        document_id=team_id,
        data=data
    )


# --- 1. CREATE TEAM ---
@router.post("/", summary="Create a Team")
async def create_team(team: TeamCreate):
    try:
        db = get_db_service()
        
        # Ensure leader is in members
        members = team.members.copy() if team.members else []
        if team.leader_id not in members:
            members.append(team.leader_id)

        data_to_save = {
            k: v for k, v in {
                "name": team.name,
                "description": team.description,
                "hackathon_id": team.hackathon_id,
                "leader_id": team.leader_id,
                "members": members,
                "looking_for": team.looking_for,
                "tech_stack": team.tech_stack,
                "status": team.status,
                "project_repo": team.project_repo
            }.items() if v is not None
        }

        result = await asyncio.to_thread(
            db.create_document,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=ID.unique(),
            data=data_to_save
        )
        
        return {"success": True, "data": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 2. DELETE TEAM ---
@router.delete("/delete", summary="Delete Team")
async def delete_team(action: TeamAction):
    try:
        db = get_db_service()

        # Fetch and verify leader in parallel
        team = await _get_team(action.team_id)

        if team['leader_id'] != action.user_id:
            raise HTTPException(status_code=403, detail="Only leader can delete.")

        await asyncio.to_thread(
            db.delete_document,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id
        )
        
        return {"success": True, "message": "Team deleted"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 3. LEAVE TEAM ---
@router.post("/leave", summary="Leave Team")
async def leave_team(action: TeamAction):
    try:
        db = get_db_service()
        team = await _get_team(action.team_id)

        current_members = team.get('members', [])

        if action.user_id not in current_members:
            raise HTTPException(status_code=400, detail="Not in team")

        # Leader leaving? Delete team
        if action.user_id == team['leader_id']:
            await asyncio.to_thread(
                db.delete_document,
                database_id=settings.APPWRITE_DATABASE_ID,
                collection_id=settings.COLLECTION_TEAMS,
                document_id=action.team_id
            )
            return {"success": True, "message": "Leader left. Team disbanded."}

        # Remove member and update
        current_members.remove(action.user_id)
        await _update_team(action.team_id, {"members": current_members})
        
        return {"success": True, "message": "Left team"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 4. LIST TEAMS (OPTIMIZED) ---
@router.get("/", summary="List All Teams")
async def list_teams():
    try:
        db = get_db_service()
        users_service = get_users_service()
        
        # 1. Fetch teams
        teams_result = await asyncio.to_thread(
            db.list_documents,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS
        )
        
        # 2. Collect all unique user IDs
        user_ids = set()
        for doc in teams_result['documents']:
            user_ids.update(doc.get('members', []))
            user_ids.update(doc.get('join_requests', []) or [])
            
        # 3. Fetch users in parallel (if any)
        user_map = {}
        if user_ids:
            # Limit concurrency to avoid rate limits
            # Appwrite doesn't support bulk fetch by ID list, so we fetch individually
            # For production, this should be cached or handled differently
            async def fetch_user_safe(uid):
                try:
                    u = await asyncio.to_thread(users_service.get, uid)
                    return u
                except:
                    return None

            users_data = await asyncio.gather(*[fetch_user_safe(uid) for uid in user_ids])
            
            for u in users_data:
                if u:
                    user_map[u['$id']] = u['name']
        
        # 4. Enrich teams
        for doc in teams_result['documents']:
            doc.setdefault('leader_id', "")
            
            # Enrich members
            doc['members_enriched'] = [
                {
                    "userId": m_id,
                    "name": user_map.get(m_id, "Unknown User"),
                    "avatar": ""
                }
                for m_id in doc.get('members', [])
            ]
            
            # Enrich join requests
            doc['join_requests_enriched'] = [
                {
                    "userId": r_id,
                    "name": user_map.get(r_id, "Unknown User")
                }
                for r_id in (doc.get('join_requests') or [])
            ]

        return teams_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 5. JOIN TEAM ---
@router.post("/join", summary="Request to Join Team")
async def join_team(action: TeamAction):
    try:
        team = await _get_team(action.team_id)

        current_members = team.get('members', [])
        current_requests = team.get('join_requests', [])

        if action.user_id in current_members:
            raise HTTPException(status_code=400, detail="Already in team")
        
        if action.user_id in current_requests:
            raise HTTPException(status_code=400, detail="Request already pending")

        current_requests.append(action.user_id)
        await _update_team(action.team_id, {"join_requests": current_requests})
        
        return {"success": True, "message": "Join request sent"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 6. APPROVE REQUEST ---
@router.post("/approve", summary="Approve Join Request")
async def approve_request(action: TeamRequestAction):
    try:
        team = await _get_team(action.team_id)

        if team['leader_id'] != action.leader_id:
            raise HTTPException(status_code=403, detail="Only leader can approve requests")

        current_requests = team.get('join_requests', [])
        current_members = team.get('members', [])

        if action.target_user_id not in current_requests:
            raise HTTPException(status_code=404, detail="Request not found")

        # Update both lists
        current_requests.remove(action.target_user_id)
        current_members.append(action.target_user_id)

        await _update_team(action.team_id, {
            "join_requests": current_requests,
            "members": current_members
        })
        
        return {"success": True, "message": "Member approved"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 7. REJECT REQUEST ---
@router.post("/reject", summary="Reject Join Request")
async def reject_request(action: TeamRequestAction):
    try:
        team = await _get_team(action.team_id)

        if team['leader_id'] != action.leader_id:
            raise HTTPException(status_code=403, detail="Only leader can reject requests")

        current_requests = team.get('join_requests', [])

        if action.target_user_id not in current_requests:
            raise HTTPException(status_code=404, detail="Request not found")

        current_requests.remove(action.target_user_id)
        await _update_team(action.team_id, {"join_requests": current_requests})
        
        return {"success": True, "message": "Request rejected"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 8. UPDATE TEAM ---
@router.put("/{team_id}", summary="Update Team Details")
async def update_team_details(team_id: str, update: TeamUpdate, user_id: str):
    try:
        team = await _get_team(team_id)
        
        if team['leader_id'] != user_id:
            raise HTTPException(status_code=403, detail="Only leader can update team")
            
        data_to_update = update.model_dump(exclude_unset=True)
        if not data_to_update:
             return {"success": True, "message": "No changes"}

        await _update_team(team_id, data_to_update)
        return {"success": True, "message": "Team updated"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 10. GET TEAM ---
@router.get("/{team_id}", summary="Get Team Details")
async def get_team(team_id: str):
    try:
        db = get_db_service()
        users_service = get_users_service()
        
        # 1. Fetch team
        team = await _get_team(team_id)
        
        # 2. Collect user IDs
        user_ids = set()
        user_ids.update(team.get('members', []))
        user_ids.update(team.get('join_requests', []) or [])
        
        # 3. Fetch users in parallel
        user_map = {}
        if user_ids:
            async def fetch_user_safe(uid):
                try:
                    u = await asyncio.to_thread(users_service.get, uid)
                    return u
                except:
                    return None

            users_data = await asyncio.gather(*[fetch_user_safe(uid) for uid in user_ids])
            
            for u in users_data:
                if u:
                    user_map[u['$id']] = u['name']
            
        # Enrich
        team.setdefault('leader_id', "")
        team['members_enriched'] = [
            {
                "userId": m_id,
                "name": user_map.get(m_id, "Unknown User"),
                "avatar": ""
            }
            for m_id in team.get('members', [])
        ]
        team['join_requests_enriched'] = [
            {
                "userId": r_id,
                "name": user_map.get(r_id, "Unknown User")
            }
            for r_id in (team.get('join_requests') or [])
        ]
        
        return team
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
