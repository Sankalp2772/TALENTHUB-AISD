from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class JobAllowedBranch(Base):
    __tablename__ = "JOB_ALLOWED_BRANCHES"

    job_id = Column(Integer, ForeignKey("JOB_LISTINGS.job_id", ondelete="CASCADE"), primary_key=True)
    branch = Column(String(20), primary_key=True)

    job = relationship("JobListing", back_populates="allowed_branches")
