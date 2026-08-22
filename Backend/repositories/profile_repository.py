from sqlalchemy.orm import Session

from storage.mysql.models.user_model import User


class ProfileRepository:

    def get_user_by_id(
        self,
        db: Session,
        user_id: int
    ):
        return (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    def update_profile_image(
        self,
        db: Session,
        user: User,
        profile_image_url: str
    ):
        user.profile_image_url = profile_image_url

        db.commit()
        db.refresh(user)

        return user