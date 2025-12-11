from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service, get_users_service
from app.core.config import settings
from app.models.user import UserRegister, UserLoginSync
from appwrite.id import ID

router = APIRouter()

# --- 1. MASTER REGISTRATION ---
@router.post("/register", summary="Register User (Auth + DB)")
def register_user(user: UserRegister):
    try:
        users_service = get_users_service()
        db_service = get_db_service()
        
        # A. Create Auth Account
        new_account_id = ID.unique()
        try:
            auth_user = users_service.create(
                user_id=new_account_id,
                email=user.email,
                password=user.password,
                name=user.name
            )
        except Exception as e:
            if "409" in str(e):
                raise HTTPException(status_code=400, detail="Email already registered")
            raise e

        # B. Create Database Profile (Matching your Schema)
        profile_data = {
            "username": user.username,
            "account_id": auth_user['$id'], # Required field
            "xp": 0,                        # Default
            "reputation_score": 0.0,        # Default
            "skills": [],                   # Default empty list
            "bio": f"Hi! I'm {user.name}",
            # avatar_url & github_url are optional, so we skip them
        }

        try:
            db_service.create_row(
                database_id=settings.APPWRITE_DATABASE_ID,
                table_id=settings.COLLECTION_USERS,
                row_id=auth_user['$id'], # Sync ID
                data=profile_data
            )
        except Exception as e:
            print(f"⚠️ Profile Creation Failed: {e}")
            # Optional: Delete the Auth account here to rollback

        return {
            "success": True, 
            "message": "User registered successfully", 
            "userId": auth_user['$id']
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 2. LOGIN SYNC ---
@router.post("/login", summary="Sync User after Login")
def login_sync(user: UserLoginSync):
    try:
        db = get_db_service()
        
        # Default Profile Data
        username_final = user.username if user.username else user.name.replace(" ", "_").lower()
        
        data_to_save = {
            "username": username_final,
            "account_id": user.id,
            "xp": 0,
            "reputation_score": 0.0,
            "skills": [],
            "bio": "New Hacker"
        }

        try:
            db.create_row(
                database_id=settings.APPWRITE_DATABASE_ID,
                table_id=settings.COLLECTION_USERS,
                row_id=user.id,
                data=data_to_save
            )
            return {"success": True, "message": "First-time login: Profile created"}
        except Exception as e:
            if "409" in str(e):
                return {"success": True, "message": "Sync OK (User exists)"}
            raise e

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))