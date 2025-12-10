from pydantic import BaseModel
from typing import List, Optional

class TeamBase(BaseModel):
    name: str
    hackathon_id: str
    leader_id: str
    members: List[str] = []     # Must be an Array in Appwrite!
    looking_for: List[str] = [] # Matches looking_for[]
    status: str = "open"        # Enum: 'open', 'closed', 'full'
    project_repo: Optional[str] = None

class TeamCreate(TeamBase):
    pass # We use the Base for creation

class TeamResponse(TeamBase):
    id: str
    created_at: str