from datetime import date

from fastapi import APIRouter, Depends, Query

from sqlalchemy.orm import Session

from controllers.attendance_controller import (
    AttendanceController
)

from dependencies.auth_dependency import (
    get_current_user
)

from storage.mysql.connection import get_db


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


controller = AttendanceController()


# =====================================================
# CHECK IN
# =====================================================

@router.post("/check-in")
def check_in(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return controller.check_in(
        db,
        current_user
    )


# =====================================================
# CHECK OUT
# =====================================================

@router.post("/check-out")
def check_out(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return controller.check_out(
        db,
        current_user
    )


# =====================================================
# TODAY
# =====================================================

@router.get("/today")
def get_today_attendance(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return controller.get_today(
        db,
        current_user
    )


# =====================================================
# HISTORY
# =====================================================

@router.get("/history")
def get_attendance_history(
    start_date: date | None = Query(
        default=None
    ),

    end_date: date | None = Query(
        default=None
    ),

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)
):

    return controller.get_history(
        db,
        current_user,
        start_date,
        end_date
    )


# =====================================================
# MONTHLY SUMMARY
# =====================================================

@router.get("/summary")
def get_attendance_summary(

    year: int = Query(
        ...,
        ge=2000,
        le=2100
    ),

    month: int = Query(
        ...,
        ge=1,
        le=12
    ),

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)
):

    return controller.get_summary(
        db,
        current_user,
        year,
        month
    )