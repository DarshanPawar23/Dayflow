from datetime import date
from enum import Enum

from pydantic import BaseModel, Field, model_validator


class LeaveType(str, Enum):
    PAID = "PAID"
    SICK = "SICK"
    UNPAID = "UNPAID"


class LeaveStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class LeaveCreateRequest(BaseModel):

    leave_type: LeaveType

    start_date: date

    end_date: date

    reason: str | None = Field(
        default=None,
        max_length=1000
    )

    @model_validator(mode="after")
    def validate_dates(self):

        if self.end_date < self.start_date:
            raise ValueError(
                "End date cannot be before start date"
            )

        return self


class LeaveRejectRequest(BaseModel):

    rejection_reason: str = Field(
        min_length=1,
        max_length=1000
    )


class LeaveResponse(BaseModel):

    id: int

    user_id: int

    leave_type: LeaveType

    start_date: date

    end_date: date

    total_days: int

    reason: str | None

    medical_certificate_url: str | None

    status: LeaveStatus

    reviewed_by: int | None

    reviewed_at: str | None

    rejection_reason: str | None