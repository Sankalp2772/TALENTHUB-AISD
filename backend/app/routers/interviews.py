from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.interview_slot import InterviewSlot
from app.models.application import Application
from app.schemas.interview import InterviewResponse, InterviewCreate, InterviewUpdate
from app.dependencies.auth import get_current_user_token, get_current_admin
from app.services.status_service import validate_status_transition

router = APIRouter(prefix="/api/interviews", tags=["Interviews"])

@router.get("", response_model=List[InterviewResponse])
def get_interviews(
    user: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db)
):
    query = db.query(InterviewSlot).join(InterviewSlot.application)
    if user["role"] == "STUDENT":
        query = query.filter(Application.student_id == user["user_id"])

    return query.order_by(InterviewSlot.scheduled_at.asc()).all()

@router.post("", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
def create_interview_slot(
    data: InterviewCreate,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    app_record = db.query(Application).filter(Application.application_id == data.application_id).first()
    if not app_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")

    # Rule 4: UNIQUE(application_id, round_number)
    existing_slot = db.query(InterviewSlot).filter(
        InterviewSlot.application_id == data.application_id,
        InterviewSlot.round_number == data.round_number
    ).first()
    if existing_slot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Interview round {data.round_number} is already scheduled for this application."
        )

    # Auto advance application status to INTERVIEW_SCHEDULED if it is SHORTLISTED or APPLIED
    if app_record.status in ["APPLIED", "SHORTLISTED"]:
        validate_status_transition(app_record.status, "INTERVIEW_SCHEDULED")
        app_record.status = "INTERVIEW_SCHEDULED"

    new_slot = InterviewSlot(
        application_id=data.application_id,
        round_number=data.round_number,
        scheduled_at=data.scheduled_at,
        venue=data.venue,
        result=data.result or "PENDING",
        notes=data.notes
    )
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.put("/{interview_id}", response_model=InterviewResponse)
def update_interview_slot(
    interview_id: int,
    data: InterviewUpdate,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    slot = db.query(InterviewSlot).filter(InterviewSlot.interview_slot_id == interview_id).first()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview slot not found.")

    if data.scheduled_at is not None:
        slot.scheduled_at = data.scheduled_at
    if data.venue is not None:
        slot.venue = data.venue
    if data.result is not None:
        slot.result = data.result
        # If result updated to PASSED or FAILED, update application status if appropriate
        if data.result.upper() in ["PASSED", "COMPLETED"]:
            if slot.application.status == "INTERVIEW_SCHEDULED":
                validate_status_transition(slot.application.status, "INTERVIEWED")
                slot.application.status = "INTERVIEWED"
    if data.notes is not None:
        slot.notes = data.notes

    db.commit()
    db.refresh(slot)
    return slot
