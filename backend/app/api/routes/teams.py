from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service, get_users_service
from app.core.config import settings
from app.models.team import TeamCreate
from pydantic import BaseModel
from appwrite.id import ID

router = APIRouter()

# Action Model for Delete/Leave
class TeamAction(BaseModel):
    team_id: str
    user_id: str

class TeamRequestAction(BaseModel):
    team_id: str
    leader_id: str
    target_user_id: str

# --- 1. CREATE TEAM ---
@router.post("/", summary="Create a Team")
def create_team(team: TeamCreate):
    try:
        db = get_db_service()
        
        if team.leader_id not in team.members:
            team.members.append(team.leader_id)

        data_to_save = {
            "name": team.name,
            "description": team.description,
            "hackathon_id": team.hackathon_id,
            "leader_id": team.leader_id,
            "members": team.members,
            # "join_requests": [], # Requires 'join_requests' attribute in Appwrite
            "looking_for": team.looking_for,
            "tech_stack": team.tech_stack,
            "status": team.status,
            "project_repo": team.project_repo
        }
        # Remove None
        data_to_save = {k: v for k, v in data_to_save.items() if v is not None}

        result = db.create_document( # <--- FIXED SDK METHOD
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
def delete_team(action: TeamAction):
    try:
        db = get_db_service()

        # Check Leader
        team = db.get_document( # <--- FIXED SDK METHOD
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id
        )

        if team['leader_id'] != action.user_id:
            raise HTTPException(status_code=403, detail="Only leader can delete.")

        # Delete
        db.delete_document( # <--- FIXED SDK METHOD
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id
        )
        return {"success": True, "message": "Team deleted"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 3. LEAVE TEAM ---
@router.post("/leave", summary="Leave Team")
def leave_team(action: TeamAction):
    try:
        db = get_db_service()

        # Get Team
        team = db.get_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id
        )

        current_members = team.get('members', [])

        if action.user_id not in current_members:
            raise HTTPException(status_code=400, detail="Not in team")

        current_members.remove(action.user_id)

        # Leader Left? Delete Team
        if action.user_id == team['leader_id']:
             db.delete_document(
                database_id=settings.APPWRITE_DATABASE_ID,
                collection_id=settings.COLLECTION_TEAMS,
                document_id=action.team_id
            )
             return {"success": True, "message": "Leader left. Team disbanded."}

        # Update Team
        db.update_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id,
            data={"members": current_members}
        )
        return {"success": True, "message": "Left team"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 4. LIST TEAMS ---
@router.get("/", summary="List All Teams")
def list_teams():
    try:
        db = get_db_service()
        users_service = get_users_service()
        
        result = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS
        )
        
        # Fetch all users to map IDs to Names
        # Note: In production, use a more efficient way (e.g. cache or batch fetch if possible)
        # For now, we list all users (limit 100)
        user_map = {}
        try:
            all_users = users_service.list(limit=100)
            user_map = {u['$id']: u['name'] for u in all_users['users']}
        except Exception as e:
            print(f"Warning: Could not fetch users: {e}")

        # Enrich teams with user names
        for doc in result['documents']:
            # Ensure leader_id is present (fallback if missing in DB)
            if 'leader_id' not in doc:
                doc['leader_id'] = ""

            # Enrich Members
            enriched_members = []
            for m_id in doc.get('members', []):
                enriched_members.append({
                    "userId": m_id,
                    "name": user_map.get(m_id, "Unknown User"),
                    "avatar": "" # Avatar URL logic if needed
                })
            doc['members_enriched'] = enriched_members
            
            # Enrich Requests
            enriched_requests = []
            for r_id in doc.get('join_requests') or []:
                enriched_requests.append({
                    "userId": r_id,
                    "name": user_map.get(r_id, "Unknown User")
                })
            doc['join_requests_enriched'] = enriched_requests

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 5. JOIN TEAM (Request) ---
@router.post("/join", summary="Request to Join Team")
def join_team(action: TeamAction):
    try:
        db = get_db_service()

        # Get Team
        team = db.get_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id
        )

        current_members = team.get('members', [])
        current_requests = team.get('join_requests') or []

        if action.user_id in current_members:
            raise HTTPException(status_code=400, detail="Already in team")
        
        if action.user_id in current_requests:
            raise HTTPException(status_code=400, detail="Request already pending")

        # Add User to Requests
        current_requests.append(action.user_id)

        # Update Team
        db.update_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id,
            data={"join_requests": current_requests}
        )
        return {"success": True, "message": "Join request sent"}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 6. APPROVE REQUEST ---
@router.post("/approve", summary="Approve Join Request")
def approve_request(action: TeamRequestAction):
    try:
        db = get_db_service()
        team = db.get_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id
        )

        if team['leader_id'] != action.leader_id:
            raise HTTPException(status_code=403, detail="Only leader can approve requests")

        current_requests = team.get('join_requests') or []
        current_members = team.get('members', [])

        if action.target_user_id not in current_requests:
            raise HTTPException(status_code=404, detail="Request not found")

        # Move from requests to members
        current_requests.remove(action.target_user_id)
        current_members.append(action.target_user_id)

        db.update_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id,
            data={
                "join_requests": current_requests,
                "members": current_members
            }
        )
        return {"success": True, "message": "Member approved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 7. REJECT REQUEST ---
@router.post("/reject", summary="Reject Join Request")
def reject_request(action: TeamRequestAction):
    try:
        db = get_db_service()
        team = db.get_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id
        )

        if team['leader_id'] != action.leader_id:
            raise HTTPException(status_code=403, detail="Only leader can reject requests")

        current_requests = team.get('join_requests') or []

        if action.target_user_id not in current_requests:
            raise HTTPException(status_code=404, detail="Request not found")

        # Remove from requests
        current_requests.remove(action.target_user_id)

        db.update_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id,
            data={"join_requests": current_requests}
        )
        return {"success": True, "message": "Request rejected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))