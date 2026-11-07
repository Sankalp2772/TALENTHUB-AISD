from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.application import Application
from app.models.student import Student
from app.schemas.application import ApplicationResponse, ApplicationCreate, ApplicationStatusUpdate
from app.services.application_service import create_application
from app.services.status_service import validate_status_transition
from app.dependencies.auth import get_current_user_token, get_current_student, get_current_admin

router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationResponse])
def get_applications(
    user: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db)
):
    query = db.query(Application)
    if user["role"] == "STUDENT":
        query = query.filter(Application.student_id == user["user_id"])

    return query.order_by(Application.applied_at.desc()).all()

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application_detail(
    application_id: int,
    user: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db)
):
    app_record = db.query(Application).filter(Application.application_id == application_id).first()
    if not app_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")

    if user["role"] == "STUDENT" and app_record.student_id != user["user_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    return app_record

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_for_job(
    data: ApplicationCreate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    app_record = create_application(db, student_id=current_student.student_id, job_id=data.job_id)
    return app_record

@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    data: ApplicationStatusUpdate,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    app_record = db.query(Application).filter(Application.application_id == application_id).first()
    if not app_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")

    new_status = data.status.strip().upper()
    
    # Enforce strict application status flow validation!
    validate_status_transition(app_record.status, new_status)

    app_record.status = new_status
    db.commit()
    db.refresh(app_record)
    return app_record
