from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from storage.mysql.connection import get_db

from controllers.hr_employee_controller import (
    HREmployeeController
)

from schemas.employee_management_schema import (
    EmployeeUpdateRequest,
    EmployeeResponse
)

from dependencies.auth_dependency import get_current_user


router = APIRouter(
    prefix="/hr/employees",
    tags=["HR - Employee Management"]
)

controller = HREmployeeController()


@router.get(
    "",
    response_model=list[EmployeeResponse]
)
def get_all_employees(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.get_all_employees(
        db,
        current_user
    )


@router.get(
    "/search",
    response_model=list[EmployeeResponse]
)
def search_employees(
    search: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.search_employees(
        db,
        search,
        current_user
    )


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def get_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.get_employee(
        db,
        employee_id,
        current_user
    )


@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def update_employee(
    employee_id: str,
    request: EmployeeUpdateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.update_employee(
        db,
        employee_id,
        request,
        current_user
    )


@router.patch(
    "/{employee_id}/deactivate"
)
def deactivate_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.deactivate_employee(
        db,
        employee_id,
        current_user
    )