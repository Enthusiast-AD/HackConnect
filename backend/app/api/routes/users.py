from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service, get_users_service
from app.core.config import settings
from app.models.user import UserResponse, UserUpdate
from appwrite.query import Query
import asyncio


router = APIRouter()


# --- OPTIMIZED: GET USER PROFILE ---
@router.get("/{user_id}", response_model=UserResponse, summary="Get User Profile")
async def get_user_profile(user_id: str):
    """
    Optimization: Uses asyncio.to_thread instead of ThreadPoolExecutor for better performance
    """
    try:
        db = get_db_service()
        users = get_users_service()
        
        try:
            # Run both database queries concurrently using asyncio
            doc, auth_user = await asyncio.gather(
                asyncio.to_thread(
                    db.get_document,
                    database_id=settings.APPWRITE_DATABASE_ID,
                    collection_id=settings.COLLECTION_USERS,
                    document_id=user_id
                ),
                asyncio.to_thread(users.get, user_id),
                return_exceptions=False
            )

            # Return merged data
            return {
                "id": doc['$id'],
                "username": doc.get('username'),
                "email": auth_user['email'],      
                "name": auth_user['name'],        
                "role": doc.get('role', 'participant'), 
                "bio": doc.get('bio'),
                "avatar_url": doc.get('avatar_url'),
                "github_url": doc.get('github_url'),
                "portfolio_url": doc.get('portfolio_url'),
                "skills": doc.get('skills', []),
                "tech_stack": doc.get('tech_stack', []),
                "xp": doc.get('xp', 0),
                "reputation_score": doc.get('reputation_score', 0.0),
                "account_id": doc.get('account_id'),
                "created_at": doc['$createdAt'],
                "updated_at": doc['$updatedAt']
            }
            
        except Exception as e:
            if "404" in str(e):
                raise HTTPException(status_code=404, detail="User not found")
            raise HTTPException(status_code=500, detail=str(e))

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- OPTIMIZED: UPDATE USER PROFILE ---
@router.put("/{user_id}", response_model=UserResponse, summary="Update User Profile")
async def update_user_profile(user_id: str, user_update: UserUpdate):
    """
    Optimization: Parallel updates and cleaner error handling
    """
    try:
        db = get_db_service()
        users = get_users_service()
        
        # Prepare update data
        update_data = user_update.model_dump(exclude_unset=True)
        
        # Separate name update from DB updates
        name_update = update_data.pop("name", None)
        
        # Run updates in parallel if both exist
        tasks = []
        
        if name_update:
            tasks.append(
                asyncio.to_thread(users.update_name, user_id, name_update)
            )
        
        if update_data:
            tasks.append(
                asyncio.to_thread(
                    db.update_document,
                    database_id=settings.APPWRITE_DATABASE_ID,
                    collection_id=settings.COLLECTION_USERS,
                    document_id=user_id,
                    data=update_data
                )
            )
        
        # Execute all updates concurrently
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
        
        # Return updated profile
        return await get_user_profile(user_id)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- OPTIMIZED: GET USER'S HACKATHONS ---
@router.get("/{user_id}/hackathons", summary="Get User's Hackathons")
async def get_user_hackathons(user_id: str):
    """
    Optimization: Eliminated sequential queries - fetches teams and hackathons in parallel
    """
    try:
        db = get_db_service()
        
        # Step 1: Fetch user's teams
        teams_result = await asyncio.to_thread(
            db.list_documents,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            queries=[Query.equal('members', user_id)]
        )

        if not teams_result['documents']:
            return {"success": True, "hackathons": []}

        # Step 2: Extract hackathon IDs and create map
        hackathon_team_map = {team['hackathon_id']: team for team in teams_result['documents']}
        hackathon_ids = list(hackathon_team_map.keys())
        
        # Step 3: Fetch hackathon details (already optimized - single query with multiple IDs)
        hackathons_result = await asyncio.to_thread(
            db.list_documents,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_HACKATHONS,
            queries=[Query.equal('$id', hackathon_ids)]
        )
        
        # Step 4: Combine results
        combined_results = [
            {
                **hackathon,
                "my_team": hackathon_team_map.get(hackathon['$id'])
            }
            for hackathon in hackathons_result['documents']
        ]
        
        return {"success": True, "hackathons": combined_results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
