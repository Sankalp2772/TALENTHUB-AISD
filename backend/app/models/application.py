from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.database import Base

class Application(Base):
    __tablename__ = "APPLICATIONS"

    application_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("STUDENTS.student_id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("JOB_LISTINGS.job_id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), default="APPLIED", nullable=False)
    applied_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint('student_id', 'job_id', name='uk_student_job'),
    )

    student = relationship("Student", back_populates="applications")
    job = relationship("JobListing", back_populates="applications")
    interview_slots = relationship("InterviewSlot", back_populates="application", cascade="all, delete-orphan")
    offer = relationship("Offer", back_populates="application", uselist=False, cascade="all, delete-orphan")
