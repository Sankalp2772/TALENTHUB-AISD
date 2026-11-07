from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.student import StudentResponse
from app.schemas.job import JobResponse
from app.schemas.interview import InterviewResponse
from app.schemas.offer import OfferResponse

class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationStatusUpdate(BaseModel):
    status: str

class ApplicationResponse(BaseModel):
    application_id: int
    student_id: int
    job_id: int
    status: str
    applied_at: datetime
    updated_at: datetime
    student: Optional[StudentResponse] = None
    job: Optional[JobResponse] = None
    interview_slots: List[InterviewResponse] = []
    offer: Optional[OfferResponse] = None

    class Config:
        from_attributes = True
