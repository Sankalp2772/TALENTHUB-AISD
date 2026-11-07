from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import (
    auth_router,
    students_router,
    companies_router,
    jobs_router,
    applications_router,
    interviews_router,
    offers_router,
    admin_router,
)
from app.seed import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TalentHub Placement Management System API",
    description="Full-stack college placement-management system REST API supporting Student and Admin workflows, status pipelines, eligibility verification, and transactional offer acceptances.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed demo data on startup
@app.on_event("startup")
def startup_event():
    seed_database()

# Register Routers
app.include_router(auth_router)
app.include_router(students_router)
app.include_router(companies_router)
app.include_router(jobs_router)
app.include_router(applications_router)
app.include_router(interviews_router)
app.include_router(offers_router)
app.include_router(admin_router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to TalentHub Placement Management System API",
        "docs": "/docs",
        "system": "TalentHub DBMS Project"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "TalentHub Backend"}
