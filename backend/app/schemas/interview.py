from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InterviewCreate(BaseModel):
    application_id: int
    round_number: int
    scheduled_at: datetime
    venue: str
    result: Optional[str] = "PENDING"
    notes: Optional[str] = None

class InterviewUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None
    venue: Optional[str] = None
    result: Optional[str] = None
    notes: Optional[str] = None

class InterviewResponse(BaseModel):
    interview_slot_id: int
    application_id: int
    round_number: int
    scheduled_at: datetime
    venue: str
    result: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True
