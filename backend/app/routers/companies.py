from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.company import Company
from app.schemas.company import CompanyResponse, CompanyCreate
from app.dependencies.auth import get_current_user_token, get_current_admin

router = APIRouter(prefix="/api/companies", tags=["Companies"])

@router.get("", response_model=List[CompanyResponse])
def get_companies(
    user: dict = Depends(get_current_user_token),
    db: Session = Depends(get_db)
):
    return db.query(Company).order_by(Company.company_name).all()

@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(
    data: CompanyCreate,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    name = data.company_name.strip()
    existing = db.query(Company).filter(Company.company_name.ilike(name)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company already exists.")
    
    company = Company(company_name=name)
    db.add(company)
    db.commit()
    db.refresh(company)
    return company
