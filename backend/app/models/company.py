from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Company(Base):
    __tablename__ = "COMPANIES"

    company_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_name = Column(String(100), unique=True, nullable=False)

    jobs = relationship("JobListing", back_populates="company", cascade="all, delete-orphan")
