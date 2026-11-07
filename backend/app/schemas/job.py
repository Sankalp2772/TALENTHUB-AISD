from pydantic import BaseModel
from datetime import date
from typing import List, Optional
from app.schemas.company import CompanyResponse

class JobAllowedBranchSchema(BaseModel):
    job_id: int
    branch: str

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    company_id: int
    role: str
    season: str
    min_cgpa: float = 0.0
    max_active_backlogs: int = 0
    drive_date: date
    is_open: bool = True
    allowed_branches: Optional[List[str]] = []  # Empty array = open to all branches!

class JobUpdate(BaseModel):
    role: Optional[str] = None
    season: Optional[str] = None
    min_cgpa: Optional[float] = None
    max_active_backlogs: Optional[int] = None
    drive_date: Optional[date] = None
    is_open: Optional[bool] = None
    allowed_branches: Optional[List[str]] = None

class JobResponse(BaseModel):
    job_id: int
    company_id: int
    role: str
    season: str
    min_cgpa: float
    max_active_backlogs: int
    drive_date: date
    is_open: bool
    company: Optional[CompanyResponse] = None
    allowed_branches: List[JobAllowedBranchSchema] = []

    class Config:
        from_attributes = True

class JobEligibilityResponse(JobResponse):
    is_eligible: bool
    ineligibility_reasons: List[str] = []
    already_applied: bool = False
    application_id: Optional[int] = None
