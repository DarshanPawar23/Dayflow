from sqlalchemy.orm import Session

from repositories.hr_leave_repository import (
    HRLeaveRepository
)


class HRLeaveService:

    def __init__(self):

        self.repository = HRLeaveRepository()

    def _validate_hr(
        self,
        current_user
    ):

        if current_user["role"] != "HR":

            raise Exception(
                "Only HR can manage leave requests"
            )

    def _get_leave(
        self,
        db: Session,
        leave_request_id: int,
        current_user
    ):

        leave_request = (
            self.repository.get_leave_by_id(
                db,
                leave_request_id,
                current_user["company_id"]
            )
        )

        if not leave_request:

            raise Exception(
                "Leave request not found"
            )

        return leave_request

    def _serialize_leave(
        self,
        leave_request
    ):

        employee = leave_request.user

        reviewer = leave_request.reviewer

        leave_type = (
            leave_request.leave_type.value
            if hasattr(
                leave_request.leave_type,
                "value"
            )
            else str(
                leave_request.leave_type
            )
        )

        status = (
            leave_request.status.value
            if hasattr(
                leave_request.status,
                "value"
            )
            else str(
                leave_request.status
            )
        )

        return {
            "id": leave_request.id,

            "employee_id":
                employee.employee_id,

            "first_name":
                employee.first_name,

            "last_name":
                employee.last_name,

            "profile_image_url":
                employee.profile_image_url,

            "leave_type":
                leave_type,

            "start_date":
                leave_request.start_date,

            "end_date":
                leave_request.end_date,

            "total_days":
                leave_request.total_days,

            "reason":
                leave_request.reason,

            "medical_certificate_url":
                leave_request.medical_certificate_url,

            "status":
                status,

            "reviewed_by":
                (
                    reviewer.employee_id
                    if reviewer
                    else None
                ),

            "reviewed_at":
                leave_request.reviewed_at,

            "rejection_reason":
                leave_request.rejection_reason,

            "created_at":
                leave_request.created_at
        }

    def get_all_leave_requests(
        self,
        db: Session,
        current_user
    ):

        self._validate_hr(current_user)

        leave_requests = (
            self.repository.get_all_leave_requests(
                db,
                current_user["company_id"]
            )
        )

        return [
            self._serialize_leave(leave_request)
            for leave_request in leave_requests
        ]

    def get_pending_leave_requests(
        self,
        db: Session,
        current_user
    ):

        self._validate_hr(current_user)

        leave_requests = (
            self.repository.get_pending_leave_requests(
                db,
                current_user["company_id"]
            )
        )

        return [
            self._serialize_leave(leave_request)
            for leave_request in leave_requests
        ]

    def get_leave_details(
        self,
        db: Session,
        leave_request_id: int,
        current_user
    ):

        self._validate_hr(current_user)

        leave_request = self._get_leave(
            db,
            leave_request_id,
            current_user
        )

        return self._serialize_leave(
            leave_request
        )

    def approve_leave(
        self,
        db: Session,
        leave_request_id: int,
        current_user
    ):

        self._validate_hr(current_user)

        leave_request = self._get_leave(
            db,
            leave_request_id,
            current_user
        )

        if leave_request.status != "PENDING":

            raise Exception(
                "Only pending leave requests can be approved"
            )

        leave_request = (
            self.repository.approve_leave(
                db,
                leave_request,
                current_user["user_id"]
            )
        )

        reviewer = leave_request.reviewer

        return {
            "message":
                "Leave approved successfully",

            "leave_request_id":
                leave_request.id,

            "status":
                leave_request.status.value
                if hasattr(
                    leave_request.status,
                    "value"
                )
                else str(
                    leave_request.status
                ),

            "reviewed_by":
                (
                    reviewer.employee_id
                    if reviewer
                    else None
                ),

            "reviewed_at":
                leave_request.reviewed_at
        }

    def reject_leave(
        self,
        db: Session,
        leave_request_id: int,
        current_user,
        rejection_reason: str
    ):

        self._validate_hr(current_user)

        if not rejection_reason.strip():

            raise Exception(
                "Rejection reason is required"
            )

        leave_request = self._get_leave(
            db,
            leave_request_id,
            current_user
        )

        if leave_request.status != "PENDING":

            raise Exception(
                "Only pending leave requests can be rejected"
            )

        leave_request = (
            self.repository.reject_leave(
                db,
                leave_request,
                current_user["user_id"],
                rejection_reason.strip()
            )
        )

        reviewer = leave_request.reviewer

        return {
            "message":
                "Leave rejected successfully",

            "leave_request_id":
                leave_request.id,

            "status":
                leave_request.status.value
                if hasattr(
                    leave_request.status,
                    "value"
                )
                else str(
                    leave_request.status
                ),

            "reviewed_by":
                (
                    reviewer.employee_id
                    if reviewer
                    else None
                ),

            "reviewed_at":
                leave_request.reviewed_at
        }