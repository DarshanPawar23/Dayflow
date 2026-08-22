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

    def get_my_profile(
        self,
        db: Session,
        user_id: int
    ):

        user = self.profile_repository.get_my_profile(
            db,
            user_id
        )

        if not user:
            raise Exception(
                "User not found"
            )

        return {
            "id": user.id,
            "employee_id": user.employee_id,

            "first_name": user.first_name,
            "last_name": user.last_name,

            "email": user.email,
            "phone": user.phone,

            "profile_image_url": user.profile_image_url,

            "role": (
                user.role.value
                if hasattr(user.role, "value")
                else user.role
            ),

            "joining_year": user.joining_year,

            "company_id": user.company.id,
            "company_name": user.company.company_name,
            "company_logo_url": user.company.logo_url,

            "must_change_password": user.must_change_password
        }