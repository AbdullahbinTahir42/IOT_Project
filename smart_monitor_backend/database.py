import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the URL from .env file
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create the Connection Engine
# pool_pre_ping=True helps prevent connection drops
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

# Create a Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our models
Base = declarative_base()

# Dependency: This gives a fresh DB session to every request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()