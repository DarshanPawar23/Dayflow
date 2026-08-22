from datetime import datetime, date
from enum import Enum

from storage.mysql.base import Base

from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)


class AttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    LEAVE = "LEAVE"


class Attendance(Base):

    __tablename__ = "attendance"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "attendance_date",
            name="uq_user_attendance_date"
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    attendance_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True
    )

    check_in_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    check_out_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    status: Mapped[AttendanceStatus] = mapped_column(
        String(20),
        nullable=False,
        default=AttendanceStatus.PRESENT
    )

    work_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )

    extra_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )

    notes: Mapped[str | None] = mapped_column(
        String(500),
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

    user: Mapped["User"] = relationship(
        back_populates="attendance_records"
    )