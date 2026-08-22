from fastapi import HTTPException
from sqlalchemy.orm import Session

from services.employee_service import EmployeeService
from schemas.employee_schema import EmployeeCreateRequest


class EmployeeController:

    def __init__(self):
        self.employee_service = EmployeeService()

    def create_employee(
        self,
        db: Session,
        request: EmployeeCreateRequest,
        current_user
    ):
        try:
            return self.employee_service.create_employee(
                db,
                request,
                current_user
            )

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )