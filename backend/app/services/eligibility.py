from typing import Tuple, List
from sqlalchemy.orm import Session
from app.models.student import Student
from app.models.job import JobListing

def check_student_eligibility(student: Student, job: JobListing) -> Tuple[bool, List[str]]:
    """
    Validates if a student is eligible for a placement drive based on core business rules:
    - student.cgpa >= job.min_cgpa
    - student.active_backlogs <= job.max_active_backlogs
    - Branch check: If 0 rows in JOB_ALLOWED_BRANCHES, open to ALL branches. Otherwise, student.branch must exist in JOB_ALLOWED_BRANCHES.
    - Drive status: is_open must be True.
    - Student status: has_accepted_offer must be False.
    """
    reasons = []

    if not job.is_open:
        reasons.append("Placement drive is closed.")

    if student.has_accepted_offer:
        reasons.append("You cannot apply because you have already accepted an offer in this placement season.")

    if student.cgpa < job.min_cgpa:
        reasons.append(f"Your CGPA ({student.cgpa:.2f}) is below minimum requirement ({job.min_cgpa:.2f}).")

    if student.active_backlogs > job.max_active_backlogs:
        reasons.append(f"Your active backlogs ({student.active_backlogs}) exceed maximum allowed ({job.max_active_backlogs}).")

    allowed_branches = [b.branch for b in job.allowed_branches]
    if len(allowed_branches) > 0 and student.branch not in allowed_branches:
        reasons.append(f"Your branch ({student.branch}) is not eligible. Allowed: {', '.join(allowed_branches)}.")

    is_eligible = len(reasons) == 0
    return is_eligible, reasons
