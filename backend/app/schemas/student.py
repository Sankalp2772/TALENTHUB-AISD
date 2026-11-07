from pydantic import BaseModel
from typing import Optional

class StudentBase(BaseModel):
    usn: str
    name: str
    email: str
    branch: str
    cgpa: float
    active_backlogs: int = 0
    cleared_backlogs: int = 0
    has_accepted_offer: bool = False

class StudentCreate(StudentBase):
    password: Optional[str] = "password123"

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    branch: Optional[str] = None
    cgpa: Optional[float] = None
    active_backlogs: Optional[int] = None
    cleared_backlogs: Optional[int] = None

class StudentResponse(StudentBase):
    student_id: int

    class Config:
        from_attributes = True
