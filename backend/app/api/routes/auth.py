from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service, get_users_service
from app.core.config import settings
from app.models.user import UserRegister, UserLoginSync, UserUpdate, PasswordChange
from appwrite.id import ID
from appwrite.exception import AppwriteException

router = APIRouter()

# --- 1. REGISTER (Create Auth + DB) ---
@router.post("/register", summary="Register New User")
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
        except AppwriteException as e:
            if e.code == 409:
                raise HTTPException(status_code=400, detail="Email already registered")
            raise e
        except Exception as e:
            if "409" in str(e):
                raise HTTPException(status_code=400, detail="Email already registered")
            raise e

        # B. Create DB Profile (Matches Schema)
        profile_data = {
            "username": user.username,
            "account_id": auth_user['$id'],
            "xp": 0,
            "reputation_score": 0.0,
            "skills": [],
            "bio": f"Hi! I'm {user.name}"
        }

        db_service.create_document(  # <--- FIXED SDK METHOD
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_USERS,
            document_id=auth_user['$id'],
            data=profile_data
        )

        return {"success": True, "message": "User registered", "userId": auth_user['$id']}

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Register Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --- 2. LOGIN (STRICT CHECK) ---
@router.post("/login", summary="Verify User Login")
def login_sync(user: UserLoginSync):
    try:
        db = get_db_service()
        
        try:
            # Check existence using correct SDK method
            db.get_document( # <--- FIXED SDK METHOD
                database_id=settings.APPWRITE_DATABASE_ID,
                collection_id=settings.COLLECTION_USERS,
                document_id=user.id
            )
            return {"success": True, "message": "User verified"}
        except Exception:
            raise HTTPException(status_code=401, detail="User not found. Please Register.")

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 3. UPDATE PROFILE ---
@router.put("/profile", summary="Update Profile")
def update_profile(data: UserUpdate):
    try:
        db = get_db_service()
        
        updates = {
            "bio": data.bio,
            "skills": data.skills,
            "github_url": data.github_url,
            "avatar_url": data.avatar_url
        }
        updates = {k: v for k, v in updates.items() if v is not None}

        if not updates:
            return {"success": False, "message": "No changes provided"}

        db.update_document( # <--- FIXED SDK METHOD
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_USERS,
            document_id=data.user_id,
            data=updates
        )
        return {"success": True, "message": "Profile updated"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 4. CHANGE PASSWORD ---
@router.post("/change-password", summary="Change Password")
def change_password(data: PasswordChange):
    try:
        users_service = get_users_service()
        users_service.update_password(
            user_id=data.user_id,
            password=data.new_password
        )
        return {"success": True, "message": "Password changed"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))