from fastapi import FastAPI

from storage.mysql.base import Base
from storage.mysql.connection import engine

from routes.auth_route import router as auth_router
from routes.hr_route import router as hr_router

from storage.mysql.models.user_model import User, Company


app = FastAPI(
    title="Dayflow HRMS",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(hr_router)