from datetime import date, datetime
from enum import Enum

from storage.mysql.base import Base

from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)


class LeaveType(str, Enum):
    PAID = "PAID"
    SICK = "SICK"
    UNPAID = "UNPAID"


class LeaveStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class LeaveRequest(Base):

    __tablename__ = "leave_requests"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    # Employee who requested the leave
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # Type of leave
    leave_type: Mapped[LeaveType] = mapped_column(
        String(20),
        nullable=False,
        index=True
    )

    # Leave period
    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    # Number of leave days
    total_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    # Reason given by employee
    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # Required for sick leave
    medical_certificate_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    # Approval status
    status: Mapped[LeaveStatus] = mapped_column(
        String(20),
        nullable=False,
        default=LeaveStatus.PENDING,
        index=True
    )

    # HR who approved/rejected the request
    reviewed_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True
    )

    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    # HR rejection reason
    rejection_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Employee relationship
    user: Mapped["User"] = relationship(
        foreign_keys=[user_id],
        back_populates="leave_requests"
    )

    # HR reviewer relationship
    reviewer: Mapped["User | None"] = relationship(
        foreign_keys=[reviewed_by]
    )