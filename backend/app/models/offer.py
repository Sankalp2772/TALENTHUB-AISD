from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Offer(Base):
    __tablename__ = "OFFERS"

    offer_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey("APPLICATIONS.application_id", ondelete="CASCADE"), nullable=False)
    package_lpa = Column(Float, nullable=False)
    offer_letter_key = Column(String(255), nullable=False)
    accepted = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint('application_id', name='uk_offer_application'),
    )

    application = relationship("Application", back_populates="offer")
