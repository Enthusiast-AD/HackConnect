from fastapi import APIRouter, HTTPException
from typing import List
from app.services.appwrite import get_db_service
from app.core.config import settings
from app.models.hackathon import HackathonCreate
from appwrite.id import ID
from fastapi.encoders import jsonable_encoder

router = APIRouter()

# --- 1. CREATE HACKATHON (Fixed) ---

@router.post("/", summary="Create a new Hackathon")
def create_hackathon(hackathon: HackathonCreate):
    try:
        db = get_db_service()
        
        # Convert Dates to Strings
        data_to_save = jsonable_encoder(hackathon)
        
        # FIX: Use 'create_row' instead of 'create_document'
        result = db.create_row(
            database_id=settings.APPWRITE_DATABASE_ID,
            table_id=settings.COLLECTION_HACKATHONS, # Use 'table_id'
            row_id=ID.unique(),                      # Use 'row_id'
            data=data_to_save
        )
        return {"success": True, "data": result}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- 2. GET ALL HACKATHONS (Fixed) ---

@router.get("/", summary="Get all Hackathons")
def get_hackathons():
    try:
        db = get_db_service()
        
        # FIX: Use 'list_rows' instead of 'list_documents'
        result = db.list_rows(
            database_id=settings.APPWRITE_DATABASE_ID,
            table_id=settings.COLLECTION_HACKATHONS
        )
        
        # The key is now 'rows'
        return {"success": True, "documents": result['rows']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 3. RECOMMENDATION ENGINE (Fixed) ---

@router.post("/recommendations", summary="Get personalized hackathons")
def get_recommendations(user_tags: List[str]):
    try:
        db = get_db_service()
        
        # FIX: Use 'list_rows'
        all_data = db.list_rows(
            database_id=settings.APPWRITE_DATABASE_ID,
            table_id=settings.COLLECTION_HACKATHONS
        )
        
        documents = all_data['rows']
        matches = []

        if not user_tags:
            return {"success": True, "documents": documents}

        for doc in documents:
            hackathon_tags = doc.get('tags', [])
            if any(tag in user_tags for tag in hackathon_tags):
                matches.append(doc)

        return {"success": True, "count": len(matches), "documents": matches}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))