from fastapi import HTTPException
from sqlalchemy.orm import Session

from services.hr_leave_service import HRLeaveService


class HRLeaveController:

    def __init__(self):
        self.service = HRLeaveService()

    def get_all_leave_requests(
        self,
        db: Session,
        current_user
    ):
        try:
            return self.service.get_all_leave_requests(
                db,
                current_user
            )

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def get_pending_leave_requests(
        self,
        db: Session,
        current_user
    ):
        try:
            return self.service.get_pending_leave_requests(
                db,
                current_user
            )

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def get_leave_details(
        self,
        db: Session,
        leave_request_id: int,
        current_user
    ):
        try:
            return self.service.get_leave_details(
                db,
                leave_request_id,
                current_user
            )

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def approve_leave(
        self,
        db: Session,
        leave_request_id: int,
        current_user
    ):
        try:
            return self.service.approve_leave(
                db,
                leave_request_id,
                current_user
            )

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def reject_leave(
        self,
        db: Session,
        leave_request_id: int,
        current_user,
        rejection_reason: str
    ):
        try:
            return self.service.reject_leave(
                db,
                leave_request_id,
                current_user,
                rejection_reason
            )

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )