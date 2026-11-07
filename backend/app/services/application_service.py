from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.application import Application
from app.models.student import Student
from app.models.job import JobListing
from app.services.eligibility import check_student_eligibility

def create_application(db: Session, student_id: int, job_id: int) -> Application:
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.")

    job = db.query(JobListing).filter(JobListing.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found.")

    # Rule 2: Duplicate Application check
    existing_app = db.query(Application).filter(
        Application.student_id == student_id,
        Application.job_id == job_id
    ).first()
    if existing_app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied for this job drive."
        )

    # Rule 1 & Rule 3 & Rule 6 check
    is_eligible, reasons = check_student_eligibility(student, job)
    if not is_eligible:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ineligible to apply: {' '.join(reasons)}"
        )

    new_app = Application(
        student_id=student_id,
        job_id=job_id,
        status="APPLIED"
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app
