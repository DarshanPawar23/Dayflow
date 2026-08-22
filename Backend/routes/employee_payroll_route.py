from fastapi import APIRouter, Depends, Query

from sqlalchemy.orm import Session

from storage.mysql.connection import get_db

from dependencies.auth_dependency import get_current_user

from controllers.employee_payroll_controller import (
    EmployeePayrollController
)


router = APIRouter(
    prefix="/employee/payroll",
    tags=["Employee Payroll"]
)

controller = EmployeePayrollController()


@router.get("")
def get_my_payrolls(
    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)
):

    return controller.get_my_payrolls(
        db,
        current_user
    )


@router.get("/monthly")
def get_my_monthly_payroll(

    month: int = Query(
        ...,
        ge=1,
        le=12
    ),

    year: int = Query(
        ...,
        ge=2000,
        le=2100
    ),

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)
):

    return controller.get_my_payroll(
        db,
        current_user,
        month,
        year
    )