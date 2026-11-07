from app.schemas.auth import LoginRequest, TokenResponse, UserProfile
from app.schemas.student import StudentBase, StudentCreate, StudentUpdate, StudentResponse
from app.schemas.company import CompanyBase, CompanyCreate, CompanyResponse
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobEligibilityResponse
from app.schemas.application import ApplicationCreate, ApplicationStatusUpdate, ApplicationResponse
from app.schemas.interview import InterviewCreate, InterviewUpdate, InterviewResponse
from app.schemas.offer import OfferCreate, OfferResponse

__all__ = [
    "LoginRequest", "TokenResponse", "UserProfile",
    "StudentBase", "StudentCreate", "StudentUpdate", "StudentResponse",
    "CompanyBase", "CompanyCreate", "CompanyResponse",
    "JobCreate", "JobUpdate", "JobResponse", "JobEligibilityResponse",
    "ApplicationCreate", "ApplicationStatusUpdate", "ApplicationResponse",
    "InterviewCreate", "InterviewUpdate", "InterviewResponse",
    "OfferCreate", "OfferResponse",
]
