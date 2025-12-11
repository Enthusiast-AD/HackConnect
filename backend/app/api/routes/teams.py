from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service
from app.core.config import settings
from app.models.team import TeamCreate
from appwrite.id import ID
from fastapi.encoders import jsonable_encoder

router = APIRouter()

@router.post("/", summary="Create a Team")
def create_team(team: TeamCreate):
    try:
        db = get_db_service()
        
        # Logic: Leader must be in members list
        if team.leader_id not in team.members:
            team.members.append(team.leader_id)

        # Prepare Data matching Schema
        data_to_save = {
            "name": team.name,
            "hackathon_id": team.hackathon_id,
            "leader_id": team.leader_id,
            "members": team.members,           # Must be Array in DB
            "looking_for": team.looking_for,   # Must be Array in DB
            "status": team.status,             # Enum (e.g. "open")
            "project_repo": team.project_repo
        }

        # Remove None values
        data_to_save = {k: v for k, v in data_to_save.items() if v is not None}

        result = db.create_row(
            database_id=settings.APPWRITE_DATABASE_ID,
            table_id=settings.COLLECTION_TEAMS,
            row_id=ID.unique(),
            data=data_to_save
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))