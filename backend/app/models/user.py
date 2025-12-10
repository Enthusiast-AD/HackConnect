from pydantic import BaseModel, EmailStr, Field, HttpUrl
from typing import List, Optional

# Shared Properties (Matches your Schema)
class UserBase(BaseModel):
    username: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None # Using str because HttpUrl can be tricky with empty strings
    github_url: Optional[str] = None
    skills: List[str] = []
    xp: int = 0
    reputation_score: float = 0.0
    account_id: str  # The link to Appwrite Auth

# Input for Registration
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str
    username: str

# Input for Login Sync
class UserLoginSync(BaseModel):
    id: str         # Auth ID
    email: EmailStr
    name: str
    username: Optional[str] = None

# Output Response
class UserResponse(UserBase):
    id: str # The $id
    created_at: str
    updated_at: str