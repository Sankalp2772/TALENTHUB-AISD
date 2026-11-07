from pydantic import BaseModel
from typing import Optional

class OfferCreate(BaseModel):
    application_id: int
    package_lpa: float
    offer_letter_key: str

class OfferResponse(BaseModel):
    offer_id: int
    application_id: int
    package_lpa: float
    offer_letter_key: str
    accepted: bool

    class Config:
        from_attributes = True
