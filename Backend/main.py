from fastapi import FastAPI

from storage.mysql.base import Base
from storage.mysql.connection import engine

from routes.auth_route import router as auth_router
from routes.hr_route import router as hr_router
from routes.profile_route import router as profile_router
from storage.mysql.models.user_model import User, Company
from routes.password_route import router as password_router
from routes.attendance_route import router as attendance_router

from routes.employee_leave_route import router as employee_leave_router
from routes.hr_leave_route import router as hr_leave_router

from routes.hr_payroll_route import router as hr_payroll_router
from routes.employee_payroll_route import router as employee_payroll_router

app = FastAPI(
    title="Dayflow HRMS",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(hr_router)
app.include_router(profile_router)
app.include_router(password_router)
app.include_router(attendance_router)
app.include_router(
    employee_leave_router
)

app.include_router(
    hr_leave_router
)
app.include_router(
    hr_payroll_router
)

app.include_router(
    employee_payroll_router
)