from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.users import Users
from app.core.config import settings
from functools import lru_cache

@lru_cache()
def get_appwrite_client():
    client = Client()
    client.set_endpoint(settings.APPWRITE_ENDPOINT)
    client.set_project(settings.APPWRITE_PROJECT_ID)
    client.set_key(settings.APPWRITE_API_KEY)
    
    # ⚡ OPTIMIZATION TIP: 
    # If using Cloud, try setting this to True temporarily to see if it speeds up the handshake.
    # client.set_self_signed(True) 
    
    return client

@lru_cache()
def get_db_service():
    client = get_appwrite_client()
    return Databases(client)

@lru_cache()
def get_users_service():
    client = get_appwrite_client()
    return Users(client)