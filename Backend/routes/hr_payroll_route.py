from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from storage.mysql.connection import get_db

from dependencies.auth_dependency import get_current_user

from controllers.hr_payroll_controller import (
    HRPayrollController
)

from schemas.payroll_schema import (
    PayrollGenerateRequest
)


router = APIRouter(
    prefix="/hr/payroll",
    tags=["HR Payroll"]
)

controller = HRPayrollController()


@router.post("/generate")
def generate_payroll(
    request: PayrollGenerateRequest,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)
):

    return controller.generate_payroll(
        db,
        current_user,
        request.user_id,
        request.monthly_salary,
        request.salary_month,
        request.salary_year
    )


@router.get("")
def get_company_payrolls(
    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)
):

    return controller.get_company_payrolls(
        db,
        current_user
    )