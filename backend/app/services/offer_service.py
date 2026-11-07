from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.offer import Offer
from app.models.application import Application
from app.models.student import Student

def accept_offer_transactional(db: Session, offer_id: int, student_id: int) -> Offer:
    """
    Rule 7 — ACCEPTING OFFER
    Transactional atomic update:
    1. OFFERS.accepted = TRUE
    2. APPLICATIONS.status = ACCEPTED
    3. STUDENTS.has_accepted_offer = TRUE
    """
    offer = db.query(Offer).filter(Offer.offer_id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found.")

    application = offer.application
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated application not found.")

    if application.student_id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to accept this offer."
        )

    student = application.student
    if student.has_accepted_offer and not offer.accepted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already accepted another offer in this placement season."
        )

    if offer.accepted:
        return offer

    try:
        # 1. Update Offer
        offer.accepted = True
        
        # 2. Update Application Status
        application.status = "ACCEPTED"
        
        # 3. Update Student Flag
        student.has_accepted_offer = True

        db.commit()
        db.refresh(offer)
        return offer
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process offer acceptance: {str(e)}"
        )
