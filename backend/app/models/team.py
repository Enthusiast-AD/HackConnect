from pydantic import BaseModel, Field
from typing import List, Optional

class TeamBase(BaseModel):
    
    hackathon_id: str
    name: str
    description: str = Field(..., max_length=150)
    leader_id: str
    members: List[str] = []     # Must be an Array in Appwrite!
    join_requests: List[str] = [] # Users requesting to join
    looking_for: List[str] = [] # Matches looking_for[] column
    tech_stack: List[str] = []  # Matches tech_stack[] column
    status: str = "open"        # Enum: 'open', 'closed', 'full'
    project_repo: Optional[str] = None

class TeamCreate(TeamBase):
    pass # We use the Base for creation

class TeamResponse(TeamBase):
    id: str
    created_at: str