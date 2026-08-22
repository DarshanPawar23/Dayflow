from fastapi import HTTPException

from sqlalchemy.orm import Session

from services.employee_management_service import (
    EmployeeManagementService
)


class HREmployeeController:

    def __init__(self):
        self.service = EmployeeManagementService()

    def get_all_employees(
        self,
        db: Session,
        current_user
    ):

        try:

            return self.service.get_all_employees(
                db,
                current_user
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def get_employee(
        self,
        db: Session,
        employee_id: str,
        current_user
    ):

        try:

            return self.service.get_employee(
                db,
                employee_id,
                current_user
            )

        except Exception as e:

            raise HTTPException(
                status_code=404,
                detail=str(e)
            )

    def search_employees(
        self,
        db: Session,
        search: str,
        current_user
    ):

        try:

            return self.service.search_employees(
                db,
                search,
                current_user
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def update_employee(
        self,
        db: Session,
        employee_id: str,
        request,
        current_user
    ):

        try:

            return self.service.update_employee(
                db,
                employee_id,
                request,
                current_user
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def deactivate_employee(
        self,
        db: Session,
        employee_id: str,
        current_user
    ):

        try:

            return self.service.deactivate_employee(
                db,
                employee_id,
                current_user
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )