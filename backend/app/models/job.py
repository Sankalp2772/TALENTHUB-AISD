from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class JobListing(Base):
    __tablename__ = "JOB_LISTINGS"

    job_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("COMPANIES.company_id", ondelete="CASCADE"), nullable=False)
    role = Column(String(100), nullable=False)
    season = Column(String(20), nullable=False)
    min_cgpa = Column(Float, default=0.0, nullable=False)
    max_active_backlogs = Column(Integer, default=0, nullable=False)
    drive_date = Column(Date, nullable=False)
    is_open = Column(Boolean, default=True, nullable=False)

    company = relationship("Company", back_populates="jobs")
    allowed_branches = relationship("JobAllowedBranch", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
