from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.job import JobListing
from app.models.application import Application
from app.models.interview_slot import InterviewSlot
from app.models.offer import Offer
from app.models.student import Student
from app.schemas.application import ApplicationResponse
from app.schemas.job import JobResponse
from app.dependencies.auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/dashboard")
def get_admin_dashboard_stats(
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    active_drives = db.query(JobListing).filter(JobListing.is_open == True).count()
    closed_drives = db.query(JobListing).filter(JobListing.is_open == False).count()
    total_applications = db.query(Application).count()
    upcoming_interviews = db.query(InterviewSlot).filter(InterviewSlot.result == "PENDING").count()
    total_offers = db.query(Offer).count()
    accepted_offers = db.query(Offer).filter(Offer.accepted == True).count()

    recent_drives = db.query(JobListing).order_by(JobListing.drive_date.desc()).limit(5).all()
    recent_applications = db.query(Application).order_by(Application.applied_at.desc()).limit(5).all()
    upcoming_interview_list = db.query(InterviewSlot).filter(InterviewSlot.result == "PENDING").order_by(InterviewSlot.scheduled_at.asc()).limit(5).all()

    return {
        "stats": {
            "active_drives": active_drives,
            "closed_drives": closed_drives,
            "total_applications": total_applications,
            "upcoming_interviews": upcoming_interviews,
            "total_offers": total_offers,
            "accepted_offers": accepted_offers
        },
        "recent_drives": [
            {
                "job_id": d.job_id,
                "company_name": d.company.company_name if d.company else "N/A",
                "role": d.role,
                "season": d.season,
                "drive_date": str(d.drive_date),
                "is_open": d.is_open
            } for d in recent_drives
        ],
        "recent_applications": [
            {
                "application_id": a.application_id,
                "student_name": a.student.name if a.student else "N/A",
                "usn": a.student.usn if a.student else "N/A",
                "company_name": a.job.company.company_name if a.job and a.job.company else "N/A",
                "role": a.job.role if a.job else "N/A",
                "status": a.status,
                "applied_at": str(a.applied_at)
            } for a in recent_applications
        ],
        "upcoming_interviews": [
            {
                "interview_slot_id": i.interview_slot_id,
                "student_name": i.application.student.name if i.application and i.application.student else "N/A",
                "company_name": i.application.job.company.company_name if i.application and i.application.job and i.application.job.company else "N/A",
                "role": i.application.job.role if i.application and i.application.job else "N/A",
                "round_number": i.round_number,
                "scheduled_at": str(i.scheduled_at),
                "venue": i.venue
            } for i in upcoming_interview_list
        ]
    }

@router.get("/jobs/{job_id}/applicants")
def get_job_applicants(
    job_id: int,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    job = db.query(JobListing).filter(JobListing.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found.")

    applications = db.query(Application).filter(Application.job_id == job_id).order_by(Application.applied_at.desc()).all()
    
    result = []
    for app in applications:
        student = app.student
        result.append({
            "application_id": app.application_id,
            "student_id": student.student_id if student else None,
            "usn": student.usn if student else "N/A",
            "name": student.name if student else "N/A",
            "email": student.email if student else "N/A",
            "branch": student.branch if student else "N/A",
            "cgpa": student.cgpa if student else 0.0,
            "active_backlogs": student.active_backlogs if student else 0,
            "cleared_backlogs": student.cleared_backlogs if student else 0,
            "has_accepted_offer": student.has_accepted_offer if student else False,
            "status": app.status,
            "applied_at": str(app.applied_at),
            "updated_at": str(app.updated_at),
            "interview_slots": [
                {
                    "interview_slot_id": slot.interview_slot_id,
                    "round_number": slot.round_number,
                    "scheduled_at": str(slot.scheduled_at),
                    "venue": slot.venue,
                    "result": slot.result,
                    "notes": slot.notes
                } for slot in app.interview_slots
            ],
            "offer": {
                "offer_id": app.offer.offer_id,
                "package_lpa": app.offer.package_lpa,
                "offer_letter_key": app.offer.offer_letter_key,
                "accepted": app.offer.accepted
            } if app.offer else None
        })

    return {
        "job": {
            "job_id": job.job_id,
            "company_name": job.company.company_name if job.company else "N/A",
            "role": job.role,
            "season": job.season,
            "min_cgpa": job.min_cgpa,
            "max_active_backlogs": job.max_active_backlogs,
            "drive_date": str(job.drive_date),
            "is_open": job.is_open,
            "allowed_branches": [b.branch for b in job.allowed_branches]
        },
        "total_applicants": len(result),
        "applicants": result
    }
