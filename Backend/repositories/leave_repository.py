from datetime import date

from sqlalchemy.orm import Session

from storage.mysql.models.leave_model import (
    LeaveRequest,
    LeaveStatus
)

from storage.mysql.models.user_model import User


class LeaveRepository:

    # -----------------------------------------
    # CREATE
    # -----------------------------------------

    def create_leave(
        self,
        db: Session,
        leave_request: LeaveRequest
    ):

        db.add(leave_request)

        db.commit()

        db.refresh(leave_request)

        return leave_request

    # -----------------------------------------
    # GET EMPLOYEE LEAVE BY ID
    # -----------------------------------------

    def get_employee_leave_by_id(
        self,
        db: Session,
        leave_id: int,
        user_id: int
    ):

        return (
            db.query(LeaveRequest)
            .filter(
                LeaveRequest.id == leave_id,
                LeaveRequest.user_id == user_id
            )
            .first()
        )

    # -----------------------------------------
    # GET EMPLOYEE LEAVE HISTORY
    # -----------------------------------------

    def get_employee_leaves(
        self,
        db: Session,
        user_id: int
    ):

        return (
            db.query(LeaveRequest)
            .filter(
                LeaveRequest.user_id == user_id
            )
            .order_by(
                LeaveRequest.created_at.desc()
            )
            .all()
        )

    # -----------------------------------------
    # CHECK OVERLAPPING LEAVE
    # -----------------------------------------

    def get_overlapping_leave(
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

                LeaveRequest.status.in_([
                    LeaveStatus.PENDING,
                    LeaveStatus.APPROVED
                ]),

                LeaveRequest.start_date <= end_date,

                LeaveRequest.end_date >= start_date
            )
            .first()
        )

    # -----------------------------------------
    # GET HR PENDING REQUESTS
    # -----------------------------------------

    def get_pending_leaves(
        self,
        db: Session,
        company_id: int
    ):

        return (
            db.query(LeaveRequest)
            .join(
                User,
                LeaveRequest.user_id == User.id
            )
            .filter(
                User.company_id == company_id,
                LeaveRequest.status == LeaveStatus.PENDING
            )
            .order_by(
                LeaveRequest.created_at.asc()
            )
            .all()
        )

    # -----------------------------------------
    # GET HR LEAVE BY ID
    # -----------------------------------------

    def get_leave_for_hr(
        self,
        db: Session,
        leave_id: int,
        company_id: int
    ):

        return (
            db.query(LeaveRequest)
            .join(
                User,
                LeaveRequest.user_id == User.id
            )
            .filter(
                LeaveRequest.id == leave_id,
                User.company_id == company_id
            )
            .first()
        )

    # -----------------------------------------
    # UPDATE LEAVE
    # -----------------------------------------

    def update_leave(
        self,
        db: Session,
        leave_request: LeaveRequest
    ):

        db.commit()

        db.refresh(leave_request)

        return leave_request