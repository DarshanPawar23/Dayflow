import bcrypt
import secrets
import string

from sqlalchemy.orm import Session

from storage.mysql.models.user_model import User
from repositories.employee_repository import EmployeeRepository
from schemas.employee_schema import EmployeeCreateRequest
from utils.employee_id_generator import generate_employee_id


class EmployeeService:

    def __init__(self):
        self.employee_repository = EmployeeRepository()

    def generate_temporary_password(self):
        characters = string.ascii_letters + string.digits
        return "".join(
            secrets.choice(characters)
            for _ in range(10)
        )

    def create_employee(
        self,
        db: Session,
        request: EmployeeCreateRequest,
        current_user
    ):

        if current_user["role"] != "HR":
            raise Exception(
                "Only HR can create employees"
            )

        existing_employee = (
            self.employee_repository.get_employee_by_email(
                db,
                request.email
            )
        )

        if existing_employee:
            raise Exception(
                "Email already registered"
            )

        company_id = current_user["company_id"]

        employee_id = generate_employee_id(
            db,
            request.first_name,
            request.last_name,
            request.joining_year
        )

        temporary_password = (
            self.generate_temporary_password()
        )

        password_hash = bcrypt.hashpw(
            temporary_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        employee = User(
            company_id=company_id,
            employee_id=employee_id,
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            phone=request.phone,
            password_hash=password_hash,
            role="EMPLOYEE",
            joining_year=request.joining_year,
            must_change_password=True
        )

        employee = (
            self.employee_repository.create_employee(
                db,
                employee
            )
        )

        return {
            "message": "Employee created successfully",
            "employee_id": employee.employee_id,
            "temporary_password": temporary_password,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "email": employee.email,
            "company_id": employee.company_id,
            "role": employee.role,
            "must_change_password": employee.must_change_password
        }