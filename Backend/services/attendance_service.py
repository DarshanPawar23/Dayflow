from datetime import date, datetime, timedelta

from sqlalchemy.orm import Session

from repositories.attendance_repository import AttendanceRepository
from storage.mysql.models.attendance_model import (
    Attendance,
    AttendanceStatus
)
from schemas.attendance_schema import (
    AttendanceActionResponse,
    AttendanceResponse,
    AttendanceSummaryResponse
)


class AttendanceService:

    STANDARD_WORK_MINUTES = 9 * 60

    def __init__(self):

        self.attendance_repository = (
            AttendanceRepository()
        )

    # -----------------------------------------
    # Utility
    # -----------------------------------------

    def format_minutes(
        self,
        minutes: int
    ) -> str:

        hours = minutes // 60
        remaining_minutes = minutes % 60

        return f"{hours:02d}:{remaining_minutes:02d}"

    def get_current_date(self) -> date:

        return datetime.utcnow().date()

    # -----------------------------------------
    # Convert model -> response
    # -----------------------------------------

    def build_attendance_response(
        self,
        attendance: Attendance
    ) -> AttendanceResponse:

        return AttendanceResponse(
            id=attendance.id,
            attendance_date=attendance.attendance_date,

            check_in_at=attendance.check_in_at,
            check_out_at=attendance.check_out_at,

            status=attendance.status,

            work_minutes=attendance.work_minutes,
            extra_minutes=attendance.extra_minutes,

            work_hours=self.format_minutes(
                attendance.work_minutes
            ),

            extra_hours=self.format_minutes(
                attendance.extra_minutes
            ),

            notes=attendance.notes
        )

    # -----------------------------------------
    # CHECK IN
    # -----------------------------------------

    def check_in(
        self,
        db: Session,
        user_id: int
    ):

        today = self.get_current_date()

        existing_attendance = (
            self.attendance_repository.get_today_attendance(
                db,
                user_id,
                today
            )
        )

        if existing_attendance:

            if existing_attendance.check_in_at:

                raise ValueError(
                    "You have already checked in today"
                )

        current_time = datetime.utcnow()

        attendance = Attendance(

            user_id=user_id,

            attendance_date=today,

            check_in_at=current_time,

            check_out_at=None,

            status=AttendanceStatus.PRESENT,

            work_minutes=0,

            extra_minutes=0,

            notes=None
        )

        attendance = (
            self.attendance_repository.create_attendance(
                db,
                attendance
            )
        )

        return AttendanceActionResponse(
            message="Check-in successful",
            attendance=self.build_attendance_response(
                attendance
            )
        )

    # -----------------------------------------
    # CHECK OUT
    # -----------------------------------------

    def check_out(
        self,
        db: Session,
        user_id: int
    ):

        today = self.get_current_date()

        attendance = (
            self.attendance_repository.get_today_attendance(
                db,
                user_id,
                today
            )
        )

        if not attendance:

            raise ValueError(
                "You must check in before checking out"
            )

        if not attendance.check_in_at:

            raise ValueError(
                "You must check in before checking out"
            )

        if attendance.check_out_at:

            raise ValueError(
                "You have already checked out today"
            )

        current_time = datetime.utcnow()

        if current_time < attendance.check_in_at:

            raise ValueError(
                "Invalid checkout time"
            )

        work_duration = (
            current_time - attendance.check_in_at
        )

        work_minutes = int(
            work_duration.total_seconds() // 60
        )

        extra_minutes = max(
            0,
            work_minutes - self.STANDARD_WORK_MINUTES
        )

        attendance.check_out_at = current_time

        attendance.work_minutes = work_minutes

        attendance.extra_minutes = extra_minutes

        attendance = (
            self.attendance_repository.update_attendance(
                db,
                attendance
            )
        )

        return AttendanceActionResponse(
            message="Check-out successful",
            attendance=self.build_attendance_response(
                attendance
            )
        )

    # -----------------------------------------
    # TODAY
    # -----------------------------------------

    def get_today_attendance(
        self,
        db: Session,
        user_id: int
    ):

        today = self.get_current_date()

        attendance = (
            self.attendance_repository.get_today_attendance(
                db,
                user_id,
                today
            )
        )

        if not attendance:

            return {
                "message": "No attendance recorded for today",
                "attendance": None
            }

        return {
            "message": "Today's attendance",
            "attendance": self.build_attendance_response(
                attendance
            )
        }

    # -----------------------------------------
    # HISTORY
    # -----------------------------------------

    def get_attendance_history(
        self,
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None
    ):

        if start_date and end_date:

            if start_date > end_date:

                raise ValueError(
                    "Start date cannot be after end date"
                )

        records = (
            self.attendance_repository.get_attendance_history(
                db,
                user_id,
                start_date,
                end_date
            )
        )

        return [
            self.build_attendance_response(record)
            for record in records
        ]

    # -----------------------------------------
    # MONTHLY SUMMARY
    # -----------------------------------------

    def get_month_summary(
        self,
        db: Session,
        user_id: int,
        year: int,
        month: int
    ):

        if month < 1 or month > 12:

            raise ValueError(
                "Month must be between 1 and 12"
            )

        start_date = date(
            year,
            month,
            1
        )

        if month == 12:

            end_date = date(
                year + 1,
                1,
                1
            ) - timedelta(days=1)

        else:

            end_date = date(
                year,
                month + 1,
                1
            ) - timedelta(days=1)

        records = (
            self.attendance_repository.get_month_attendance(
                db,
                user_id,
                start_date,
                end_date
            )
        )

        present_days = sum(
            1
            for record in records
            if record.status == AttendanceStatus.PRESENT
        )

        leave_days = sum(
            1
            for record in records
            if record.status == AttendanceStatus.LEAVE
        )

        total_work_minutes = sum(
            record.work_minutes
            for record in records
        )

        total_extra_minutes = sum(
            record.extra_minutes
            for record in records
        )

        return AttendanceSummaryResponse(

            month=month,

            year=year,

            present_days=present_days,

            leave_days=leave_days,

            total_working_days=len(records),

            total_work_minutes=total_work_minutes,

            total_extra_minutes=total_extra_minutes,

            total_work_hours=self.format_minutes(
                total_work_minutes
            ),

            total_extra_hours=self.format_minutes(
                total_extra_minutes
            )
        )