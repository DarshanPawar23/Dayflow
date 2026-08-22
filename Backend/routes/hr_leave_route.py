from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from storage.mysql.connection import get_db

from dependencies.auth_dependency import (
    get_current_user
)

from controllers.hr_leave_controller import (
    HRLeaveController
)

from schemas.leave_schema import LeaveRejectRequest


router = APIRouter(
    prefix="/hr/leaves",
    tags=["HR Leave"]
)

controller = HRLeaveController()


# =====================================================
# GET PENDING LEAVE REQUESTS
# =====================================================

@router.get("")
def get_pending_leaves(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    return controller.get_pending_leaves(
        db,
        current_user
    )


# =====================================================
# APPROVE LEAVE
# =====================================================

@router.put("/{leave_id}/approve")
def approve_leave(

    leave_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    return controller.approve_leave(
        db,
        current_user,
        leave_id
    )


# =====================================================
# REJECT LEAVE
# =====================================================

@router.put("/{leave_id}/reject")
def reject_leave(

    leave_id: int,

    request: LeaveRejectRequest,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    return controller.reject_leave(
        db,
        current_user,
        leave_id,
        request.rejection_reason
    )