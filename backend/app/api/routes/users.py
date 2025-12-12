from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service, get_users_service
from app.core.config import settings
from app.models.user import UserResponse

router = APIRouter()

@router.get("/{user_id}", response_model=UserResponse, summary="Get User Profile")
def get_user_profile(user_id: str):
    try:
        db = get_db_service()
        users = get_users_service()
        
        try:
            # 1. Fetch from Appwrite Database (Profile Data)
            doc = db.get_document(
                database_id=settings.APPWRITE_DATABASE_ID,
                collection_id=settings.COLLECTION_USERS,
                document_id=user_id
            )
            
            # 2. Fetch from Appwrite Auth (Account Data like Email/Name)
            # We use the 'account_id' from the doc, or 'user_id' if they are the same (which they are in our logic)
            auth_user = users.get(user_id)

            # Map to UserResponse
            return {
                "id": doc['$id'],
                "username": doc.get('username'),
                "email": auth_user['email'],      # From Auth
                "name": auth_user['name'],        # From Auth
                "bio": doc.get('bio'),
                "avatar_url": doc.get('avatar_url'),
                "github_url": doc.get('github_url'),
                "skills": doc.get('skills', []),
                "xp": doc.get('xp', 0),
                "reputation_score": doc.get('reputation_score', 0.0),
                "account_id": doc.get('account_id'),
                "created_at": doc['$createdAt'],
                "updated_at": doc['$updatedAt']
            }
            
        except Exception as e:
            # If document not found
            if "404" in str(e):
                raise HTTPException(status_code=404, detail="User not found")
            raise e

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
