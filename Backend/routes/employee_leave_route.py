from datetime import date

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    UploadFile
)

from sqlalchemy.orm import Session

from storage.mysql.connection import get_db

from dependencies.auth_dependency import (
    get_current_user
)

from controllers.employee_leave_controller import (
    EmployeeLeaveController
)

from storage.mysql.models.leave_model import LeaveType


router = APIRouter(
    prefix="/employee/leaves",
    tags=["Employee Leave"]
)

controller = EmployeeLeaveController()


# =====================================================
# APPLY LEAVE
# =====================================================

@router.post("")
async def apply_leave(

    leave_type: LeaveType = Form(...),

    start_date: date = Form(...),

    end_date: date = Form(...),

    reason: str | None = Form(None),

    medical_certificate: UploadFile | None = File(None),

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)
):

    return await controller.apply_leave(

        db,

        current_user,

        leave_type,

        start_date,

        end_date,

        reason,

        medical_certificate
    )


# =====================================================
# GET MY LEAVE HISTORY
# =====================================================

@router.get("")
def get_my_leaves(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)
):

    return controller.get_my_leaves(
        db,
        current_user
    )


# =====================================================
# GET MY LEAVE BY ID
# =====================================================

@router.get("/{leave_id}")
def get_my_leave(

    leave_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)
):

    return controller.get_my_leave(
        db,
        current_user,
        leave_id
    )