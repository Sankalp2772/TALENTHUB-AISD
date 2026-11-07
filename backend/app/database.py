import os
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./talenthub.db")

# Fallback mechanism if MySQL URL fails or SQLite is specified
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
    # Test connection
    with engine.connect() as conn:
        pass
except Exception as e:
    print(f"[Warning] Failed to connect using {DATABASE_URL}. Falling back to SQLite: talenthub.db. Error: {e}")
    DATABASE_URL = "sqlite:///./talenthub.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

if DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
