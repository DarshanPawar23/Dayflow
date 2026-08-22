from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
engine = create_engine(
      Config.DATABASE_URL,
      echo=False,
      pool_pre_ping=True
)

session = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

def get_db():
    db=session()
    try:
        yield db
    finally:
        db.close()