from datetime import date

from fastapi import HTTPException

from sqlalchemy.orm import Session

from services.attendance_service import AttendanceService


class AttendanceController:

    def __init__(self):

        self.attendance_service = (
            AttendanceService()
        )

    # -----------------------------------------
    # CHECK IN
    # -----------------------------------------

    def check_in(
        self,
        db: Session,
        current_user
    ):

        try:

            return self.attendance_service.check_in(
                db,
                current_user["user_id"]
            )

        except ValueError as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    # -----------------------------------------
    # CHECK OUT
    # -----------------------------------------

    def check_out(
        self,
        db: Session,
        current_user
    ):

        try:

            return self.attendance_service.check_out(
                db,
                current_user["user_id"]
            )

        except ValueError as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    # -----------------------------------------
    # TODAY
    # -----------------------------------------

    def get_today(
        self,
        db: Session,
        current_user
    ):

        try:

            return self.attendance_service.get_today_attendance(
                db,
                current_user["user_id"]
            )

        except ValueError as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    # -----------------------------------------
    # HISTORY
    # -----------------------------------------

    def get_history(
        self,
        db: Session,
        current_user,
        start_date: date | None = None,
        end_date: date | None = None
    ):

        try:

            return self.attendance_service.get_attendance_history(
                db,
                current_user["user_id"],
                start_date,
                end_date
            )

        except ValueError as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    # -----------------------------------------
    # SUMMARY
    # -----------------------------------------

    def get_summary(
        self,
        db: Session,
        current_user,
        year: int,
        month: int
    ):

        try:

            return self.attendance_service.get_month_summary(
                db,
                current_user["user_id"],
                year,
                month
            )

        except ValueError as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )