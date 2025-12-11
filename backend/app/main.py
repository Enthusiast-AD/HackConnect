from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import hackathons
from app.services.appwrite import get_db_service # <--- NEW IMPORT
from app.api.routes import hackathons, auth
app = FastAPI(title=settings.PROJECT_NAME)

@app.get("/")
def read_root():
    # 1. Default status
    appwrite_status = "Checking..."
    error_message = None

    # 2. Try to "Ping" Appwrite
    try:
        db = get_db_service()
        # We try to fetch just 1 item to see if the connection is alive
        # (We use the new 'list_rows' syntax you just added)
        db.list_rows(
            database_id=settings.APPWRITE_DATABASE_ID,
            table_id=settings.COLLECTION_HACKATHONS,
        )
        appwrite_status = "✅ Connected to Appwrite"
    except Exception as e:
        appwrite_status = "❌ Connection Failed"
        error_message = str(e)

    # 3. Return the Report
    return {
        "server_status": "online", 
        "project": settings.PROJECT_NAME,
        "appwrite": appwrite_status,
        "error_details": error_message, # Will be null if everything is fine
        "docs_url": "http://localhost:8000/docs"
    }

# Register Routes
app.include_router(hackathons.router, prefix="/api/hackathons", tags=["Hackathons"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])