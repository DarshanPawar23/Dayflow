from fastapi import HTTPException

from sqlalchemy.orm import Session

from services.payroll_service import PayrollService


class HRPayrollController:

    def __init__(self):

        self.payroll_service = PayrollService()

    def generate_payroll(
        self,
        db: Session,
        current_user,
        user_id: int,
        monthly_salary: float,
        salary_month: int,
        salary_year: int
    ):

        try:

            return self.payroll_service.generate_payroll(
                db,
                current_user,
                user_id,
                monthly_salary,
                salary_month,
                salary_year
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def get_company_payrolls(
        self,
        db: Session,
        current_user
    ):

        try:

            return self.payroll_service.get_company_payrolls(
                db,
                current_user
            )

        except Exception as e:

            raise HTTPException(
                status_code=403,
                detail=str(e)
            )