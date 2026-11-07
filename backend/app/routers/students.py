from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.student import Student
from app.schemas.student import StudentResponse, StudentUpdate
from app.dependencies.auth import get_current_student, get_current_admin

router = APIRouter(prefix="/api/students", tags=["Students"])

@router.get("/me", response_model=StudentResponse)
def get_student_profile(current_student: Student = Depends(get_current_student)):
    return current_student

@router.put("/me", response_model=StudentResponse)
def update_student_profile(
    data: StudentUpdate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    if data.name is not None:
        current_student.name = data.name
    if data.email is not None:
        current_student.email = data.email
    if data.branch is not None:
        current_student.branch = data.branch
    if data.cgpa is not None:
        current_student.cgpa = data.cgpa
    if data.active_backlogs is not None:
        current_student.active_backlogs = data.active_backlogs
    if data.cleared_backlogs is not None:
        current_student.cleared_backlogs = data.cleared_backlogs

    db.commit()
    db.refresh(current_student)
    return current_student

@router.get("", response_model=List[StudentResponse])
def list_students(
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Student).all()
