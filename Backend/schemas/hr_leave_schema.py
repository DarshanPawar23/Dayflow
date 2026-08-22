from datetime import date, datetime

from pydantic import BaseModel


class HRLeaveResponse(BaseModel):

    id: int

    employee_id: str

    first_name: str

    last_name: str

    profile_image_url: str | None = None

    leave_type: str

    start_date: date

    end_date: date

    total_days: int

    reason: str | None = None

    medical_certificate_url: str | None = None

    status: str

    reviewed_by: str | None = None

    reviewed_at: datetime | None = None

    rejection_reason: str | None = None

    created_at: datetime


class HRLeaveActionResponse(BaseModel):

    message: str

    leave_request_id: int

    status: str

    reviewed_by: str | None = None

    reviewed_at: datetime | None = None


class RejectLeaveRequest(BaseModel):

    rejection_reason: str