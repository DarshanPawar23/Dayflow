from datetime import date

from sqlalchemy.orm import Session

from storage.mysql.models.user_model import User
from storage.mysql.models.attendance_model import Attendance
from storage.mysql.models.leave_model import (
    LeaveRequest,
    LeaveStatus
)


class HRAttendanceRepository:

    def get_company_employees(
        self,
        db: Session,
        company_id: int,
        employee_id: str | None = None
    ):

        query = (
            db.query(User)
            .filter(
                User.company_id == company_id,
                User.role == "EMPLOYEE"
            )
        )

        if employee_id:
            query = query.filter(
                User.employee_id == employee_id
            )

        return (
            query
            .order_by(
                User.first_name.asc()
            )
            .all()
        )

    def get_attendance_records(
        self,
        db: Session,
        user_ids: list[int],
        start_date: date,
        end_date: date
    ):

        if not user_ids:
            return []

        return (
            db.query(Attendance)
            .filter(
                Attendance.user_id.in_(user_ids),
                Attendance.attendance_date >= start_date,
                Attendance.attendance_date <= end_date
            )
            .all()
        )

    def get_approved_leaves(
        self,
        db: Session,
        user_ids: list[int],
        start_date: date,
        end_date: date
    ):

        if not user_ids:
            return []

        return (
            db.query(LeaveRequest)
            .filter(
                LeaveRequest.user_id.in_(user_ids),
                LeaveRequest.status == LeaveStatus.APPROVED,
                LeaveRequest.start_date <= end_date,
                LeaveRequest.end_date >= start_date
            )
            .all()
        )

    def get_employee_by_employee_id(
        self,
        db: Session,
        company_id: int,
        employee_id: str
    ):

        return (
            db.query(User)
            .filter(
                User.company_id == company_id,
                User.employee_id == employee_id,
                User.role == "EMPLOYEE"
            )
            .first()
        )