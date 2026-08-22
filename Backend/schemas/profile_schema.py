from fastapi import UploadFile

from sqlalchemy.orm import Session

from repositories.profile_repository import ProfileRepository
from utils.file_storage import save_profile_image


class ProfileService:

    def __init__(self):
        self.profile_repository = ProfileRepository()

    async def update_profile_image(
        self,
        db: Session,
        user_id: int,
        image: UploadFile
    ):

        user = self.profile_repository.get_user_by_id(
            db,
            user_id
        )

        if not user:
            raise Exception(
                "User not found"
            )

        profile_image_url = await save_profile_image(
            image,
            user_id
        )

        user = self.profile_repository.update_profile_image(
            db,
            user,
            profile_image_url
        )

        return {
            "message": "Profile image updated successfully",
            "profile_image_url": user.profile_image_url
        }