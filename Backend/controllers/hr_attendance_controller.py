from datetime import date

from fastapi import HTTPException

from sqlalchemy.orm import Session

from services.hr_attendance_service import (
    HRAttendanceService
)


class HRAttendanceController:

    def __init__(self):

        self.service = HRAttendanceService()

    def get_attendance_report(
        self,
        db: Session,
        current_user,
        start_date: date,
        end_date: date,
        employee_id: str | None = None
    ):

        try:

            return self.service.get_attendance_report(
                db,
                current_user,
                start_date,
                end_date,
                employee_id
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )