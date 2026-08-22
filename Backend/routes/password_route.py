from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from storage.mysql.connection import get_db
from dependencies.auth_dependency import get_current_user

from controllers.password_controller import PasswordController
from schemas.password_schema import ChangePasswordRequest


router = APIRouter(
    prefix="/password",
    tags=["Password"]
)


controller = PasswordController()


@router.post("/change")
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return controller.change_password(
        db,
        request,
        current_user
    )