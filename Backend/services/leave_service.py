from datetime import date, datetime

from fastapi import UploadFile

from sqlalchemy.orm import Session

from storage.mysql.models.leave_model import (
    LeaveRequest,
    LeaveType,
    LeaveStatus
)

from repositories.leave_repository import LeaveRepository

from utils.file_storage import save_medical_certificate


class LeaveService:

    def __init__(self):

        self.leave_repository = LeaveRepository()

    # =====================================================
    # EMPLOYEE - APPLY LEAVE
    # =====================================================

    async def apply_leave(
        self,
        db: Session,
        current_user,
        leave_type: LeaveType,
        start_date: date,
        end_date: date,
        reason: str | None,
        medical_certificate: UploadFile | None
    ):

        user_id = current_user["user_id"]

        # -----------------------------------------
        # DATE VALIDATION
        # -----------------------------------------

        if end_date < start_date:

            raise Exception(
                "End date cannot be before start date"
            )

        # -----------------------------------------
        # CALCULATE DAYS
        # -----------------------------------------

        total_days = (
            end_date - start_date
        ).days + 1

        # -----------------------------------------
        # SICK LEAVE VALIDATION
        # -----------------------------------------

        if (
            leave_type == LeaveType.SICK
            and medical_certificate is None
        ):

            raise Exception(
                "Medical certificate is required for sick leave"
            )

        # -----------------------------------------
        # NON-SICK LEAVE SHOULD NOT HAVE CERTIFICATE
        # -----------------------------------------

        if (
            leave_type != LeaveType.SICK
            and medical_certificate is not None
        ):

            raise Exception(
                "Medical certificate is only required for sick leave"
            )

        # -----------------------------------------
        # CHECK OVERLAPPING LEAVE
        # -----------------------------------------

        existing_leave = (
            self.leave_repository.get_overlapping_leave(
                db,
                user_id,
                start_date,
                end_date
            )
        )

        if existing_leave:

            raise Exception(
                "You already have a pending or approved leave for this period"
            )

        # -----------------------------------------
        # SAVE MEDICAL CERTIFICATE
        # -----------------------------------------

        medical_certificate_url = None

        if medical_certificate:

            medical_certificate_url = (
                await save_medical_certificate(
                    medical_certificate,
                    user_id
                )
            )

        # -----------------------------------------
        # CREATE LEAVE
        # -----------------------------------------

        leave_request = LeaveRequest(

            user_id=user_id,

            leave_type=leave_type,

            start_date=start_date,

            end_date=end_date,

            total_days=total_days,

            reason=reason,

            medical_certificate_url=(
                medical_certificate_url
            ),

            status=LeaveStatus.PENDING
        )

        leave_request = (
            self.leave_repository.create_leave(
                db,
                leave_request
            )
        )

        return self._format_leave_response(
            leave_request
        )

    # =====================================================
    # EMPLOYEE - GET OWN LEAVE HISTORY
    # =====================================================

    def get_my_leaves(
        self,
        db: Session,
        current_user
    ):

        user_id = current_user["user_id"]

        leaves = (
            self.leave_repository.get_employee_leaves(
                db,
                user_id
            )
        )

        return [
            self._format_leave_response(leave)
            for leave in leaves
        ]

    # =====================================================
    # EMPLOYEE - GET OWN LEAVE
    # =====================================================

    def get_my_leave(
        self,
        db: Session,
        current_user,
        leave_id: int
    ):

        user_id = current_user["user_id"]

        leave = (
            self.leave_repository.get_employee_leave_by_id(
                db,
                leave_id,
                user_id
            )
        )

        if not leave:

            raise Exception(
                "Leave request not found"
            )

        return self._format_leave_response(
            leave
        )

    # =====================================================
    # HR - GET PENDING LEAVES
    # =====================================================

    def get_pending_leaves(
        self,
        db: Session,
        current_user
    ):

        if current_user["role"] != "HR":

            raise Exception(
                "Only HR can view leave requests"
            )

        company_id = current_user["company_id"]

        leaves = (
            self.leave_repository.get_pending_leaves(
                db,
                company_id
            )
        )

        return [
            self._format_leave_response(leave)
            for leave in leaves
        ]

    # =====================================================
    # HR - APPROVE LEAVE
    # =====================================================

    def approve_leave(
        self,
        db: Session,
        current_user,
        leave_id: int
    ):

        if current_user["role"] != "HR":

            raise Exception(
                "Only HR can approve leave requests"
            )

        company_id = current_user["company_id"]

        leave = (
            self.leave_repository.get_leave_for_hr(
                db,
                leave_id,
                company_id
            )
        )

        if not leave:

            raise Exception(
                "Leave request not found"
            )

        if leave.status != LeaveStatus.PENDING:

            raise Exception(
                "Only pending leave requests can be approved"
            )

        leave.status = LeaveStatus.APPROVED

        leave.reviewed_by = current_user["user_id"]

        leave.reviewed_at = datetime.utcnow()

        leave.rejection_reason = None

        leave = (
            self.leave_repository.update_leave(
                db,
                leave
            )
        )

        return {
            "message": "Leave approved successfully",
            "leave_id": leave.id,
            "status": leave.status
        }

    # =====================================================
    # HR - REJECT LEAVE
    # =====================================================

    def reject_leave(
        self,
        db: Session,
        current_user,
        leave_id: int,
        rejection_reason: str
    ):

        if current_user["role"] != "HR":

            raise Exception(
                "Only HR can reject leave requests"
            )

        company_id = current_user["company_id"]

        leave = (
            self.leave_repository.get_leave_for_hr(
                db,
                leave_id,
                company_id
            )
        )

        if not leave:

            raise Exception(
                "Leave request not found"
            )

        if leave.status != LeaveStatus.PENDING:

            raise Exception(
                "Only pending leave requests can be rejected"
            )

        leave.status = LeaveStatus.REJECTED

        leave.reviewed_by = current_user["user_id"]

        leave.reviewed_at = datetime.utcnow()

        leave.rejection_reason = rejection_reason

        leave = (
            self.leave_repository.update_leave(
                db,
                leave
            )
        )

        return {
            "message": "Leave rejected successfully",
            "leave_id": leave.id,
            "status": leave.status,
            "rejection_reason": leave.rejection_reason
        }

    # =====================================================
    # RESPONSE FORMATTER
    # =====================================================

    def _format_leave_response(
        self,
        leave: LeaveRequest
    ):

        return {
            "id": leave.id,
            "user_id": leave.user_id,
            "leave_type": leave.leave_type,
            "start_date": leave.start_date,
            "end_date": leave.end_date,
            "total_days": leave.total_days,
            "reason": leave.reason,
            "medical_certificate_url": (
                leave.medical_certificate_url
            ),
            "status": leave.status,
            "reviewed_by": leave.reviewed_by,
            "reviewed_at": (
                leave.reviewed_at.isoformat()
                if leave.reviewed_at
                else None
            ),
            "rejection_reason": (
                leave.rejection_reason
            )
        }