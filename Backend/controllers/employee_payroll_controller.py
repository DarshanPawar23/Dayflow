from fastapi import HTTPException

from sqlalchemy.orm import Session

from services.payroll_service import PayrollService


class EmployeePayrollController:

    def __init__(self):

        self.payroll_service = PayrollService()

    def get_my_payrolls(
        self,
        db: Session,
        current_user
    ):

        try:

            return self.payroll_service.get_my_payrolls(
                db,
                current_user
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def get_my_payroll(
        self,
        db: Session,
        current_user,
        month: int,
        year: int
    ):

        try:

            return self.payroll_service.get_my_payroll(
                db,
                current_user,
                month,
                year
            )

        except Exception as e:

            raise HTTPException(
                status_code=404,
                detail=str(e)
            )