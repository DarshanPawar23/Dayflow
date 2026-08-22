from datetime import date, datetime

from sqlalchemy.orm import Session

from storage.mysql.models.attendance_model import Attendance


class AttendanceRepository:

    def create_attendance(
        self,
        db: Session,
        attendance: Attendance
    ):

        db.add(attendance)
        db.commit()
        db.refresh(attendance)

        return attendance

    def get_today_attendance(
        self,
        db: Session,
        user_id: int,
        attendance_date: date
    ):

        return (
            db.query(Attendance)
            .filter(
                Attendance.user_id == user_id,
                Attendance.attendance_date == attendance_date
            )
            .first()
        )

    def get_attendance_by_id(
        self,
        db: Session,
        attendance_id: int,
        user_id: int
    ):

        return (
            db.query(Attendance)
            .filter(
                Attendance.id == attendance_id,
                Attendance.user_id == user_id
            )
            .first()
        )

    def update_attendance(
        self,
        db: Session,
        attendance: Attendance
    ):

        db.commit()
        db.refresh(attendance)

        return attendance

    def get_attendance_history(
        self,
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None
    ):

        query = (
            db.query(Attendance)
            .filter(
                Attendance.user_id == user_id
            )
        )

        if start_date:
            query = query.filter(
                Attendance.attendance_date >= start_date
            )

        if end_date:
            query = query.filter(
                Attendance.attendance_date <= end_date
            )

        return (
            query
            .order_by(
                Attendance.attendance_date.desc()
            )
            .all()
        )

    def get_month_attendance(
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
            .order_by(
                Attendance.attendance_date.asc()
            )
            .all()
        )