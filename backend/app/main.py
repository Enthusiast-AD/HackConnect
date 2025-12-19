from fastapi import FastAPI, Request
import socket
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import hackathons
from app.services.appwrite import get_db_service # <--- NEW IMPORT
from app.api.routes import hackathons, auth, users, teams
import time

# --- 🚀 FIX: FORCE IPV4 (Paste this at the top) ---
# This forces Python to ignore IPv6, fixing the 30s timeout on Cloud.
def force_ipv4():
    old_getaddrinfo = socket.getaddrinfo
    def new_getaddrinfo(*args, **kwargs):
        responses = old_getaddrinfo(*args, **kwargs)
        return [r for r in responses if r[0] == socket.AF_INET]
    socket.getaddrinfo = new_getaddrinfo

force_ipv4() # <--- Run it immediately

app = FastAPI(title=settings.PROJECT_NAME)
# --- 1. PERFORMANCE TIMER (Add This Block) ---
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    
    # Run the request
    response = await call_next(request)
    
    # Calculate time
    process_time = time.time() - start_time
    
    # Add it to the response headers (so Frontend can see it)
    response.headers["X-Process-Time"] = str(process_time)
    
    # Print to your console
    print(f"⏱️ API LOG: {request.method} {request.url.path} completed in {process_time:.4f} seconds")
    
    return response

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://hack-connect-vert.vercel.app"],  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    status = "Checking..."
    try:
        # CORRECT METHOD: list_documents (Plural)
        get_db_service().list_documents(
            database_id=settings.APPWRITE_DATABASE_ID, 
            collection_id=settings.COLLECTION_HACKATHONS
        )
        status = "✅ Connected to Appwrite"
    except Exception as e:
        status = f"❌ Connection Failed: {str(e)}"

    return {
        "status": status,
        "docs": "http://localhost:8000/docs"
    }

# Register Routes
app.include_router(hackathons.router, prefix="/api/hackathons", tags=["Hackathons"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(teams.router, prefix="/api/teams", tags=["Teams"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

