from datetime import date

from fastapi import HTTPException, UploadFile

from sqlalchemy.orm import Session

from services.leave_service import LeaveService

from storage.mysql.models.leave_model import LeaveType


class EmployeeLeaveController:

    def __init__(self):

        self.leave_service = LeaveService()

    # -----------------------------------------
    # APPLY
    # -----------------------------------------

    async def apply_leave(
        self,
        db: Session,
        current_user,
        leave_type: LeaveType,
        start_date: date,
        end_date: date,
        reason: str | None,
        medical_certificate: UploadFile | None
    ):

        try:

            return await self.leave_service.apply_leave(
                db,
                current_user,
                leave_type,
                start_date,
                end_date,
                reason,
                medical_certificate
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    # -----------------------------------------
    # MY LEAVES
    # -----------------------------------------

    def get_my_leaves(
        self,
        db: Session,
        current_user
    ):

        try:

            return self.leave_service.get_my_leaves(
                db,
                current_user
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    # -----------------------------------------
    # MY LEAVE BY ID
    # -----------------------------------------

    def get_my_leave(
        self,
        db: Session,
        current_user,
        leave_id: int
    ):

        try:

            return self.leave_service.get_my_leave(
                db,
                current_user,
                leave_id
            )

        except Exception as e:

            raise HTTPException(
                status_code=404,
                detail=str(e)
            )