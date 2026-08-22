from fastapi import FastAPI

from storage.mysql.base import Base
from storage.mysql.connection import engine
from storage.mysql.models.user_model import User, Company

from routes.auth_route import router as auth_router


app = FastAPI(
    title="TODO API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
