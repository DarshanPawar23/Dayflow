from fastapi import HTTPException

from sqlalchemy.orm import Session

from services.leave_service import LeaveService


class HRLeaveController:

    def __init__(self):

        self.leave_service = LeaveService()

    # -----------------------------------------
    # GET PENDING
    # -----------------------------------------

    def get_pending_leaves(
        self,
        db: Session,
        current_user
    ):

        try:

            return self.leave_service.get_pending_leaves(
                db,
                current_user
            )

        except Exception as e:

            raise HTTPException(
                status_code=403,
                detail=str(e)
            )

    # -----------------------------------------
    # APPROVE
    # -----------------------------------------

    def approve_leave(
        self,
        db: Session,
        current_user,
        leave_id: int
    ):

        try:

            return self.leave_service.approve_leave(
                db,
                current_user,
                leave_id
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    # -----------------------------------------
    # REJECT
    # -----------------------------------------

    def reject_leave(
        self,
        db: Session,
        current_user,
        leave_id: int,
        rejection_reason: str
    ):

        try:

            return self.leave_service.reject_leave(
                db,
                current_user,
                leave_id,
                rejection_reason
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )