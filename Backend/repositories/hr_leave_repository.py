from datetime import datetime

from sqlalchemy.orm import Session

from storage.mysql.models.leave_model import (
    LeaveRequest,
    LeaveStatus
)

from storage.mysql.models.user_model import User


class HRLeaveRepository:

    def get_all_leave_requests(
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
                User.role == "EMPLOYEE"
            )
            .order_by(
                LeaveRequest.created_at.desc()
            )
            .all()
        )

    def get_pending_leave_requests(
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
                User.role == "EMPLOYEE",
                LeaveRequest.status == LeaveStatus.PENDING
            )
            .order_by(
                LeaveRequest.created_at.desc()
            )
            .all()
        )

    def get_leave_by_id(
        self,
        db: Session,
        leave_request_id: int,
        company_id: int
    ):

        return (
            db.query(LeaveRequest)
            .join(
                User,
                LeaveRequest.user_id == User.id
            )
            .filter(
                LeaveRequest.id == leave_request_id,
                User.company_id == company_id,
                User.role == "EMPLOYEE"
            )
            .first()
        )

    def approve_leave(
        self,
        db: Session,
        leave_request: LeaveRequest,
        hr_user_id: int
    ):

        leave_request.status = LeaveStatus.APPROVED

        leave_request.reviewed_by = hr_user_id

        leave_request.reviewed_at = datetime.utcnow()

        leave_request.rejection_reason = None

        db.commit()

        db.refresh(leave_request)

        return leave_request

    def reject_leave(
        self,
        db: Session,
        leave_request: LeaveRequest,
        hr_user_id: int,
        rejection_reason: str
    ):

        leave_request.status = LeaveStatus.REJECTED

        leave_request.reviewed_by = hr_user_id

        leave_request.reviewed_at = datetime.utcnow()

        leave_request.rejection_reason = rejection_reason

        db.commit()

        db.refresh(leave_request)

        return leave_request