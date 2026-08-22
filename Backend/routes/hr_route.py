from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from storage.mysql.connection import get_db
from dependencies.auth_dependency import get_current_user

from controllers.employee_controller import EmployeeController
from schemas.employee_schema import EmployeeCreateRequest


router = APIRouter(
    prefix="/hr",
    tags=["HR"]
)

controller = EmployeeController()


@router.post("/employees")
def create_employee(
    request: EmployeeCreateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.create_employee(
        db,
        request,
        current_user
    )