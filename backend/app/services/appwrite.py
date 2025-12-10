from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.services.users import Users  # <--- NEW: Import Users Service
from app.core.config import settings

def get_appwrite_client():
    client = Client()
    client.set_endpoint(settings.APPWRITE_ENDPOINT)
    client.set_project(settings.APPWRITE_PROJECT_ID)
    client.set_key(settings.APPWRITE_API_KEY)
    return client

def get_db_service():
    client = get_appwrite_client()
    return TablesDB(client)

# <--- NEW: Helper to access Auth Users
def get_users_service():
    client = get_appwrite_client()
    return Users(client)