from fastapi import APIRouter, HTTPException
from typing import List
from app.services.appwrite import get_db_service
from app.core.config import settings
from app.models.hackathon import HackathonCreate
from appwrite.id import ID
from appwrite.query import Query
from fastapi.encoders import jsonable_encoder
import asyncio

router = APIRouter()


# --- 1. CREATE HACKATHON ---
@router.post("/", summary="Create a new Hackathon")
async def create_hackathon(hackathon: HackathonCreate):
    try:
        db = get_db_service()
        
        result = await asyncio.to_thread(
            db.create_document,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_HACKATHONS,
            document_id=ID.unique(),
            data=jsonable_encoder(hackathon)
        )
        
        return {"success": True, "data": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 2. GET ALL HACKATHONS ---
@router.get("/", summary="Get all Hackathons")
async def get_hackathons():
    try:
        db = get_db_service()
        
        result = await asyncio.to_thread(
            db.list_documents,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_HACKATHONS
        )
        
        return {"success": True, "documents": result['documents']}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 3. GET HACKATHON BY ID ---
@router.get("/{hackathon_id}", summary="Get Hackathon by ID")
async def get_hackathon(hackathon_id: str):
    try:
        db = get_db_service()
        
        result = await asyncio.to_thread(
            db.get_document,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_HACKATHONS,
            document_id=hackathon_id
        )
        
        return {"success": True, "data": result}
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="Hackathon not found")


# --- 4. RECOMMENDATION ENGINE (OPTIMIZED) ---
@router.post("/recommendations", summary="Get personalized hackathons")
async def get_recommendations(user_tags: List[str]):
    try:
        db = get_db_service()
        
        # Fetch all hackathons
        all_data = await asyncio.to_thread(
            db.list_documents,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_HACKATHONS
        )
        
        documents = all_data['documents']
        
        # If no tags provided, return all
        if not user_tags:
            return {"success": True, "documents": documents}
        
        # Convert user_tags to set for O(1) lookup (MAJOR OPTIMIZATION)
        user_tags_set = set(user_tags)
        
        # Filter matches using list comprehension with set intersection
        matches = [
            doc for doc in documents
            if user_tags_set & set(doc.get('tags', []))
        ]
        
        return {"success": True, "count": len(matches), "documents": matches}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 5. GET HACKATHON TEAMS ---
@router.get("/{hackathon_id}/teams", summary="Get all teams registered for a hackathon")
async def get_hackathon_teams(hackathon_id: str):
    try:
        db = get_db_service()
        
        result = await asyncio.to_thread(
            db.list_documents,
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            queries=[Query.equal('hackathon_id', hackathon_id)]
        )
        
        return {"success": True, "teams": result['documents']}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
