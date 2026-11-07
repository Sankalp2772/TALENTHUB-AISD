from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Student(Base):
    __tablename__ = "STUDENTS"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usn = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    branch = Column(String(20), nullable=False)
    cgpa = Column(Float, nullable=False)
    active_backlogs = Column(Integer, default=0, nullable=False)
    cleared_backlogs = Column(Integer, default=0, nullable=False)
    has_accepted_offer = Column(Boolean, default=False, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
