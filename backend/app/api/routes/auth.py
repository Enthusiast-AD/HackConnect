from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service, get_users_service
from app.core.config import settings
from app.models.user import UserRegister, UserLoginSync, UserUpdate, PasswordChange, UserResponse
from appwrite.id import ID
from appwrite.exception import AppwriteException
import asyncio


router = APIRouter()


# --- OPTIMIZED: REGISTER ---
@router.post("/register", response_model=UserResponse, summary="Register New User")
async def register_user(user: UserRegister):
    """
    Optimization: Uses async but keeps sequential flow (auth must complete before DB)
    """
    try:
        users_service = get_users_service()
        db_service = get_db_service()
        
        # A. Create Auth Account (must be first)
        new_account_id = ID.unique()
        try:
            auth_user = await asyncio.to_thread(
                users_service.create,
                user_id=new_account_id,
                email=user.email,
                password=user.password,
                name=user.name
            )
        except AppwriteException as e:
            if e.code == 409:
                raise HTTPException(status_code=400, detail="Email already registered")
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            if "409" in str(e):
                raise HTTPException(status_code=400, detail="Email already registered")
            raise HTTPException(status_code=500, detail=str(e))

        # B. Create DB Profile
        profile_data = {
            "username": user.username,
            "account_id": auth_user['$id'],
            "role": user.role,
            "xp": 0,
            "reputation_score": 0.0,
            "skills": [],
            "tech_stack": [],
            "bio": f"Hi! I'm {user.name}"
        }

        doc = await asyncio.to_thread(
            db_service.create_document,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_USERS,
            document_id=auth_user['$id'],
            data=profile_data
        )

        # C. Return full data
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

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- OPTIMIZED: LOGIN ---
@router.post("/login", response_model=UserResponse, summary="Verify User Login & Fetch Profile")
async def login_sync(user: UserLoginSync):
    """
    Optimization: Parallel DB + auth queries using asyncio.gather
    """
    try:
        db = get_db_service()
        users_service = get_users_service()
        
        try:
            # Run both queries in parallel
            doc, auth_user = await asyncio.gather(
                asyncio.to_thread(
                    db.get_document,
                    database_id=settings.APPWRITE_DATABASE_ID,
                    collection_id=settings.COLLECTION_USERS,
                    document_id=user.id
                ),
                asyncio.to_thread(users_service.get, user.id),
                return_exceptions=False
            )
        except Exception:
            raise HTTPException(status_code=401, detail="User not found or Session Invalid.")

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

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- OPTIMIZED: UPDATE PROFILE ---
@router.put("/profile", summary="Update Profile")
async def update_profile(data: UserUpdate):
    """
    Optimization: Async execution for non-blocking I/O
    """
    try:
        db = get_db_service()
        
        # Filter out None values
        updates = {
            "bio": data.bio,
            "skills": data.skills,
            "github_url": data.github_url,
            "avatar_url": data.avatar_url
        }
        updates = {k: v for k, v in updates.items() if v is not None}

        if not updates:
            return {"success": False, "message": "No changes provided"}

        await asyncio.to_thread(
            db.update_document,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_USERS,
            document_id=data.user_id,
            data=updates
        )
        
        return {"success": True, "message": "Profile updated"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- OPTIMIZED: CHANGE PASSWORD ---
@router.post("/change-password", summary="Change Password")
async def change_password(data: PasswordChange):
    """
    Optimization: Async execution for non-blocking I/O
    """
    try:
        users_service = get_users_service()
        
        await asyncio.to_thread(
            users_service.update_password,
            user_id=data.user_id,
            password=data.new_password
        )
        
        return {"success": True, "message": "Password changed"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
