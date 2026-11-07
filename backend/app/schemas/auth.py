from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str  # "STUDENT" or "ADMIN"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    name: str
    email: str

class UserProfile(BaseModel):
    user_id: int
    role: str
    name: str
    email: str
