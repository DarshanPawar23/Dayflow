from fastapi import APIRouter, Depends, File, UploadFile

from sqlalchemy.orm import Session

from storage.mysql.connection import get_db

from controllers.profile_controller import ProfileController

from dependencies.auth_dependency import get_current_user


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

controller = ProfileController()


@router.put("/image")
async def update_profile_image(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return await controller.update_profile_image(
        db,
        current_user["user_id"],
        image
    )