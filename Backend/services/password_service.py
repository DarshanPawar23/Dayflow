import bcrypt

from sqlalchemy.orm import Session

from repositories.password_repository import PasswordRepository
from schemas.password_schema import ChangePasswordRequest


class PasswordService:

    def __init__(self):
        self.password_repository = PasswordRepository()

    def change_password(
        self,
        db: Session,
        request: ChangePasswordRequest,
        current_user
    ):

        user_id = current_user["user_id"]

        user = self.password_repository.get_user_by_id(
            db,
            user_id
        )

        if not user:
            raise Exception(
                "User not found"
            )

        if not bcrypt.checkpw(
            request.current_password.encode("utf-8"),
            user.password_hash.encode("utf-8")
        ):
            raise Exception(
                "Current password is incorrect"
            )

        hashed_password = bcrypt.hashpw(
            request.new_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        user = self.password_repository.update_password(
            db,
            user,
            hashed_password
        )

        return {
            "message": "Password changed successfully",
            "must_change_password": user.must_change_password
        }