from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.job import JobListing
from app.models.job_allowed_branch import JobAllowedBranch
from app.models.company import Company
from app.models.student import Student
from app.models.application import Application
from app.schemas.job import JobResponse, JobCreate, JobUpdate, JobEligibilityResponse
from app.services.eligibility import check_student_eligibility
from app.dependencies.auth import get_current_user_token, get_current_admin

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.get("", response_model=List[JobResponse])
def get_jobs(
    search: Optional[str] = None,
    branch: Optional[str] = None,
    season: Optional[str] = None,
    min_cgpa: Optional[float] = None,
    is_open: Optional[bool] = None,
    user: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db)
):
    query = db.query(JobListing)

    if search:
        search_pattern = f"%{search}%"
        query = query.join(JobListing.company).filter(
            (JobListing.role.ilike(search_pattern)) | 
            (Company.company_name.ilike(search_pattern))
        )

    if season:
        query = query.filter(JobListing.season == season)

    if min_cgpa is not None:
        query = query.filter(JobListing.min_cgpa <= min_cgpa)

    if is_open is not None:
        query = query.filter(JobListing.is_open == is_open)

    jobs = query.order_by(JobListing.drive_date.desc()).all()

    if branch:
        filtered = []
        for job in jobs:
            allowed = [b.branch for b in job.allowed_branches]
            if len(allowed) == 0 or branch in allowed:
                filtered.append(job)
        return filtered

    return jobs

@router.get("/{job_id}", response_model=JobEligibilityResponse)
def get_job_detail(
    job_id: int,
    user: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db)
):
    job = db.query(JobListing).filter(JobListing.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found.")

    is_eligible = True
    ineligibility_reasons = []
    already_applied = False
    application_id = None

    if user["role"] == "STUDENT":
        student = db.query(Student).filter(Student.student_id == user["user_id"]).first()
        if student:
            is_eligible, ineligibility_reasons = check_student_eligibility(student, job)
            
            existing_app = db.query(Application).filter(
                Application.student_id == student.student_id,
                Application.job_id == job.job_id
            ).first()
            if existing_app:
                already_applied = True
                application_id = existing_app.application_id

    response_dict = {
        "job_id": job.job_id,
        "company_id": job.company_id,
        "role": job.role,
        "season": job.season,
        "min_cgpa": job.min_cgpa,
        "max_active_backlogs": job.max_active_backlogs,
        "drive_date": job.drive_date,
        "is_open": job.is_open,
        "company": job.company,
        "allowed_branches": job.allowed_branches,
        "is_eligible": is_eligible,
        "ineligibility_reasons": ineligibility_reasons,
        "already_applied": already_applied,
        "application_id": application_id
    }
    return response_dict

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    data: JobCreate,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.company_id == data.company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid company ID.")

    new_job = JobListing(
        company_id=data.company_id,
        role=data.role,
        season=data.season,
        min_cgpa=data.min_cgpa,
        max_active_backlogs=data.max_active_backlogs,
        drive_date=data.drive_date,
        is_open=data.is_open
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    # Insert allowed branches if provided (if list is non-empty)
    if data.allowed_branches:
        for b in set(data.allowed_branches):
            if b.strip():
                branch_rec = JobAllowedBranch(job_id=new_job.job_id, branch=b.strip().upper())
                db.add(branch_rec)
        db.commit()
        db.refresh(new_job)

    return new_job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    data: JobUpdate,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    job = db.query(JobListing).filter(JobListing.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found.")

    if data.role is not None:
        job.role = data.role
    if data.season is not None:
        job.season = data.season
    if data.min_cgpa is not None:
        job.min_cgpa = data.min_cgpa
    if data.max_active_backlogs is not None:
        job.max_active_backlogs = data.max_active_backlogs
    if data.drive_date is not None:
        job.drive_date = data.drive_date
    if data.is_open is not None:
        job.is_open = data.is_open

    if data.allowed_branches is not None:
        # Clear existing branches
        db.query(JobAllowedBranch).filter(JobAllowedBranch.job_id == job_id).delete()
        for b in set(data.allowed_branches):
            if b.strip():
                db.add(JobAllowedBranch(job_id=job_id, branch=b.strip().upper()))

    db.commit()
    db.refresh(job)
    return job

@router.patch("/{job_id}/status", response_model=JobResponse)
def toggle_job_status(
    job_id: int,
    is_open: bool,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    job = db.query(JobListing).filter(JobListing.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found.")

    job.is_open = is_open
    db.commit()
    db.refresh(job)
    return job
