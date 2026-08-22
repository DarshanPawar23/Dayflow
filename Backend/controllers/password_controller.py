from fastapi import HTTPException
from sqlalchemy.orm import Session

from services.password_service import PasswordService
from schemas.password_schema import ChangePasswordRequest


class PasswordController:

    def __init__(self):
        self.password_service = PasswordService()

    def change_password(
        self,
        db: Session,
        request: ChangePasswordRequest,
        current_user
    ):
        try:
            return self.password_service.change_password(
                db,
                request,
                current_user
            )

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )