from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class InterviewSlot(Base):
    __tablename__ = "INTERVIEW_SLOTS"

    interview_slot_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey("APPLICATIONS.application_id", ondelete="CASCADE"), nullable=False)
    round_number = Column(Integer, nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    venue = Column(String(150), nullable=False)
    result = Column(String(50), default="PENDING", nullable=True)
    notes = Column(Text, nullable=True)

    __table_args__ = (
        UniqueConstraint('application_id', 'round_number', name='uk_app_round'),
    )

    application = relationship("Application", back_populates="interview_slots")
