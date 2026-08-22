from datetime import datetime
from enum import Enum

from storage.mysql.base import Base

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    Float,
    String,
    UniqueConstraint
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)


class PayrollStatus(str, Enum):
    GENERATED = "GENERATED"
    PAID = "PAID"


class Payroll(Base):

    __tablename__ = "payrolls"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "salary_month",
            "salary_year",
            name="uq_user_payroll_month"
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

    salary_month: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    salary_year: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    monthly_salary: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    basic_salary: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    hra: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    other_allowances: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    gross_salary: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    total_working_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    present_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    paid_leave_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    unpaid_leave_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    absent_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    payable_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    unpaid_leave_deduction: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0
    )

    total_deductions: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0
    )

    net_salary: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    status: Mapped[PayrollStatus] = mapped_column(
        String(20),
        nullable=False,
        default=PayrollStatus.GENERATED
    )

    generated_at: Mapped[datetime] = mapped_column(
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
        back_populates="payroll_records"
    )