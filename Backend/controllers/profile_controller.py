from fastapi import HTTPException, UploadFile

from sqlalchemy.orm import Session

from services.profile_service import ProfileService


class ProfileController:

    def __init__(self):
        self.profile_service = ProfileService()

    async def update_profile_image(
        self,
        db: Session,
        user_id: int,
        image: UploadFile
    ):

        try:
            return await self.profile_service.update_profile_image(
                db,
                user_id,
                image
            )

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def get_my_profile(
        self,
        db: Session,
        user_id: int
    ):

        try:
            return self.profile_service.get_my_profile(
                db,
                user_id
            )

        except Exception as e:
            raise HTTPException(
                status_code=404,
                detail=str(e)
            )