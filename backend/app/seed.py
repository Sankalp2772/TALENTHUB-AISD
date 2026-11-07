from datetime import date, datetime
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.student import Student
from app.models.company import Company
from app.models.job import JobListing
from app.models.job_allowed_branch import JobAllowedBranch
from app.models.application import Application
from app.models.interview_slot import InterviewSlot
from app.models.offer import Offer
from app.dependencies.auth import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Check if DB already seeded
        if db.query(Student).count() > 0:
            print("[Seed] Database already initialized with data.")
            return

        print("[Seed] Initializing TalentHub database with realistic demo data...")

        default_pwd = "password123"

        # 1. Add Students
        students_data = [
            Student(student_id=1, usn="1RV21CS001", name="Asha Sharma", email="asha@student.edu", branch="CSE", cgpa=9.20, active_backlogs=0, cleared_backlogs=0, has_accepted_offer=False, hashed_password=default_pwd),
            Student(student_id=2, usn="1RV21IS045", name="Rahul Kumar", email="rahul@student.edu", branch="ISE", cgpa=8.40, active_backlogs=0, cleared_backlogs=1, has_accepted_offer=False, hashed_password=default_pwd),
            Student(student_id=3, usn="1RV21EC089", name="Sneha Patel", email="sneha@student.edu", branch="ECE", cgpa=7.80, active_backlogs=1, cleared_backlogs=0, has_accepted_offer=False, hashed_password=default_pwd),
            Student(student_id=4, usn="1RV21EE012", name="Vikram Singh", email="vikram@student.edu", branch="EEE", cgpa=6.90, active_backlogs=0, cleared_backlogs=2, has_accepted_offer=False, hashed_password=default_pwd),
            Student(student_id=5, usn="1RV21ME034", name="Ananya Rao", email="ananya@student.edu", branch="ME", cgpa=8.90, active_backlogs=0, cleared_backlogs=0, has_accepted_offer=False, hashed_password=default_pwd),
            Student(student_id=6, usn="1RV21CV056", name="Karthik Nair", email="karthik@student.edu", branch="CIVIL", cgpa=7.10, active_backlogs=2, cleared_backlogs=1, has_accepted_offer=False, hashed_password=default_pwd),
        ]
        db.add_all(students_data)
        db.commit()

        # 2. Add Companies
        companies_data = [
            Company(company_id=1, company_name="Infosys"),
            Company(company_id=2, company_name="TCS"),
            Company(company_id=3, company_name="Capgemini"),
            Company(company_id=4, company_name="Amazon"),
            Company(company_id=5, company_name="Google"),
            Company(company_id=6, company_name="Microsoft"),
        ]
        db.add_all(companies_data)
        db.commit()

        # 3. Add Job Listings
        jobs_data = [
            JobListing(job_id=1, company_id=1, role="Systems Engineer", season="2025-2026", min_cgpa=6.50, max_active_backlogs=2, drive_date=date(2025, 11, 15), is_open=True),
            JobListing(job_id=2, company_id=2, role="Digital Graduate Trainee", season="2025-2026", min_cgpa=7.00, max_active_backlogs=1, drive_date=date(2025, 11, 20), is_open=True),
            JobListing(job_id=3, company_id=3, role="Senior Software Analyst", season="2025-2026", min_cgpa=7.50, max_active_backlogs=0, drive_date=date(2025, 11, 25), is_open=True),
            JobListing(job_id=4, company_id=4, role="Software Development Engineer I (SDE-1)", season="2025-2026", min_cgpa=8.50, max_active_backlogs=0, drive_date=date(2025, 12, 1), is_open=True),
            JobListing(job_id=5, company_id=5, role="Software Engineer", season="2025-2026", min_cgpa=8.75, max_active_backlogs=0, drive_date=date(2025, 12, 10), is_open=True),
            JobListing(job_id=6, company_id=6, role="Cloud Solution Engineer", season="2025-2026", min_cgpa=8.00, max_active_backlogs=0, drive_date=date(2025, 10, 1), is_open=False),
        ]
        db.add_all(jobs_data)
        db.commit()

        # 4. Add Job Allowed Branches
        branches_data = [
            JobAllowedBranch(job_id=1, branch="CSE"),
            JobAllowedBranch(job_id=1, branch="ISE"),
            JobAllowedBranch(job_id=1, branch="ECE"),
            JobAllowedBranch(job_id=1, branch="EEE"),

            # Job 2 (TCS): zero rows -> Open to ALL branches!

            JobAllowedBranch(job_id=3, branch="CSE"),
            JobAllowedBranch(job_id=3, branch="ISE"),
            JobAllowedBranch(job_id=3, branch="ECE"),

            JobAllowedBranch(job_id=4, branch="CSE"),
            JobAllowedBranch(job_id=4, branch="ISE"),

            JobAllowedBranch(job_id=5, branch="CSE"),
            JobAllowedBranch(job_id=5, branch="ISE"),
            JobAllowedBranch(job_id=5, branch="ECE"),
        ]
        db.add_all(branches_data)
        db.commit()

        # 5. Add Applications
        applications_data = [
            Application(application_id=1, student_id=1, job_id=4, status="OFFERED", applied_at=datetime(2025, 10, 2, 10, 0, 0), updated_at=datetime(2025, 10, 5, 14, 0, 0)),
            Application(application_id=2, student_id=1, job_id=5, status="INTERVIEW_SCHEDULED", applied_at=datetime(2025, 10, 3, 11, 30, 0), updated_at=datetime(2025, 10, 4, 9, 0, 0)),
            Application(application_id=3, student_id=2, job_id=1, status="SHORTLISTED", applied_at=datetime(2025, 10, 2, 14, 15, 0), updated_at=datetime(2025, 10, 3, 16, 20, 0)),
            Application(application_id=4, student_id=2, job_id=2, status="APPLIED", applied_at=datetime(2025, 10, 4, 9, 45, 0), updated_at=datetime(2025, 10, 4, 9, 45, 0)),
            Application(application_id=5, student_id=3, job_id=1, status="APPLIED", applied_at=datetime(2025, 10, 5, 16, 0, 0), updated_at=datetime(2025, 10, 5, 16, 0, 0)),
            Application(application_id=6, student_id=5, job_id=4, status="SHORTLISTED", applied_at=datetime(2025, 10, 3, 12, 0, 0), updated_at=datetime(2025, 10, 4, 10, 0, 0)),
        ]
        db.add_all(applications_data)
        db.commit()

        # 6. Add Interview Slots
        interviews_data = [
            InterviewSlot(interview_slot_id=1, application_id=1, round_number=1, scheduled_at=datetime(2025, 10, 4, 10, 0, 0), venue="Virtual Room A / Amazon Chime", result="PASSED", notes="Candidate demonstrated excellent DSA problem solving abilities."),
            InterviewSlot(interview_slot_id=2, application_id=1, round_number=2, scheduled_at=datetime(2025, 10, 5, 11, 30, 0), venue="Virtual Room B / Amazon Chime", result="PASSED", notes="Strong architectural understanding and communication skills."),
            InterviewSlot(interview_slot_id=3, application_id=2, round_number=1, scheduled_at=datetime(2025, 10, 10, 14, 0, 0), venue="Google Meet - Room 3", result="PENDING", notes="Google Technical Interview Round 1."),
        ]
        db.add_all(interviews_data)
        db.commit()

        # 7. Add Offers
        offers_data = [
            Offer(offer_id=1, application_id=1, package_lpa=28.50, offer_letter_key="OFFER_AMZ_2025_ASHA_001.pdf", accepted=False)
        ]
        db.add_all(offers_data)
        db.commit()

        print("[Seed] TalentHub database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
