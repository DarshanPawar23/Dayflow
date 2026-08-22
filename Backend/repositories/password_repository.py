from sqlalchemy.orm import Session

from storage.mysql.models.user_model import User


class PasswordRepository:

    def get_user_by_id(self, db: Session, user_id: int):
        return (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    def update_password(
        self,
        db: Session,
        user: User,
        password_hash: str
    ):
        user.password_hash = password_hash
        user.must_change_password = False

        db.commit()
        db.refresh(user)

        return user