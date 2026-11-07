from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.offer import Offer
from app.models.application import Application
from app.models.student import Student
from app.schemas.offer import OfferResponse, OfferCreate
from app.services.offer_service import accept_offer_transactional
from app.services.status_service import validate_status_transition
from app.dependencies.auth import get_current_user_token, get_current_student, get_current_admin

router = APIRouter(prefix="/api/offers", tags=["Offers"])

@router.get("", response_model=List[OfferResponse])
def get_offers(
    user: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db)
):
    query = db.query(Offer).join(Offer.application)
    if user["role"] == "STUDENT":
        query = query.filter(Application.student_id == user["user_id"])

    return query.order_by(Offer.offer_id.desc()).all()

@router.post("", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
def create_offer(
    data: OfferCreate,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    app_record = db.query(Application).filter(Application.application_id == data.application_id).first()
    if not app_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")

    # Rule 5: UNIQUE(application_id)
    existing_offer = db.query(Offer).filter(Offer.application_id == data.application_id).first()
    if existing_offer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An offer has already been generated for this application."
        )

    # Transition application status to OFFERED
    validate_status_transition(app_record.status, "OFFERED")
    app_record.status = "OFFERED"

    new_offer = Offer(
        application_id=data.application_id,
        package_lpa=data.package_lpa,
        offer_letter_key=data.offer_letter_key,
        accepted=False
    )
    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)
    return new_offer

@router.patch("/{offer_id}/accept", response_model=OfferResponse)
def accept_offer(
    offer_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    updated_offer = accept_offer_transactional(
        db=db,
        offer_id=offer_id,
        student_id=current_student.student_id
    )
    return updated_offer
