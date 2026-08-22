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

from schemas.hr_leave_schema import (
    RejectLeaveRequest
)


router = APIRouter(
    prefix="/hr/leaves",
    tags=["HR Leave Management"]
)


controller = HRLeaveController()


@router.get("")
def get_all_leave_requests(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.get_all_leave_requests(
        db,
        current_user
    )


@router.get("/pending")
def get_pending_leave_requests(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.get_pending_leave_requests(
        db,
        current_user
    )


@router.get("/{leave_request_id}")
def get_leave_details(
    leave_request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.get_leave_details(
        db,
        leave_request_id,
        current_user
    )


@router.put("/{leave_request_id}/approve")
def approve_leave(
    leave_request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.approve_leave(
        db,
        leave_request_id,
        current_user
    )


@router.put("/{leave_request_id}/reject")
def reject_leave(
    leave_request_id: int,
    request: RejectLeaveRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return controller.reject_leave(
        db,
        leave_request_id,
        current_user,
        request.rejection_reason
    )