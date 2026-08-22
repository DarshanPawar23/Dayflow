from datetime import date

from sqlalchemy.orm import Session

from storage.mysql.models.payroll_model import Payroll
from storage.mysql.models.user_model import User
from storage.mysql.models.attendance_model import Attendance
from storage.mysql.models.leave_model import (
    LeaveRequest,
    LeaveStatus,
    LeaveType
)


class PayrollRepository:

    def get_employee_by_id(
        self,
        db: Session,
        user_id: int
    ):

        return (
            db.query(User)
            .filter(
                User.id == user_id,
                User.role == "EMPLOYEE"
            )
            .first()
        )

    def get_employee_by_company(
        self,
        db: Session,
        user_id: int,
        company_id: int
    ):

        return (
            db.query(User)
            .filter(
                User.id == user_id,
                User.company_id == company_id,
                User.role == "EMPLOYEE"
            )
            .first()
        )

    def get_payroll(
        self,
        db: Session,
        user_id: int,
        month: int,
        year: int
    ):

        return (
            db.query(Payroll)
            .filter(
                Payroll.user_id == user_id,
                Payroll.salary_month == month,
                Payroll.salary_year == year
            )
            .first()
        )

    def create_payroll(
        self,
        db: Session,
        payroll: Payroll
    ):

        db.add(payroll)
        db.commit()
        db.refresh(payroll)

        return payroll

    def get_attendance_records(
        self,
        db: Session,
        user_id: int,
        start_date: date,
        end_date: date
    ):

        return (
            db.query(Attendance)
            .filter(
                Attendance.user_id == user_id,
                Attendance.attendance_date >= start_date,
                Attendance.attendance_date <= end_date
            )
            .all()
        )

    def get_approved_leaves(
        self,
        db: Session,
        user_id: int,
        start_date: date,
        end_date: date
    ):

        return (
            db.query(LeaveRequest)
            .filter(
                LeaveRequest.user_id == user_id,

                LeaveRequest.status == LeaveStatus.APPROVED,

                LeaveRequest.start_date <= end_date,

                LeaveRequest.end_date >= start_date
            )
            .all()
        )

    def get_employee_payrolls(
        self,
        db: Session,
        user_id: int
    ):

        return (
            db.query(Payroll)
            .filter(
                Payroll.user_id == user_id
            )
            .order_by(
                Payroll.salary_year.desc(),
                Payroll.salary_month.desc()
            )
            .all()
        )

    def get_company_payrolls(
        self,
        db: Session,
        company_id: int
    ):

        return (
            db.query(Payroll)
            .join(
                User,
                Payroll.user_id == User.id
            )
            .filter(
                User.company_id == company_id
            )
            .order_by(
                Payroll.salary_year.desc(),
                Payroll.salary_month.desc()
            )
            .all()
        )

    def update_payroll_status(
        self,
        db: Session,
        payroll: Payroll,
        status: str
    ):

        payroll.status = status

        db.commit()
        db.refresh(payroll)

        return payroll