from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel


class HRAttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    LEAVE = "LEAVE"
    HALF_DAY = "HALF_DAY"


class HRAttendanceRecord(BaseModel):

    employee_id: str

    first_name: str

    last_name: str

    profile_image_url: str | None = None

    attendance_date: date

    check_in_at: datetime | None = None

    check_out_at: datetime | None = None

    work_minutes: int = 0

    extra_minutes: int = 0

    status: HRAttendanceStatus

    leave_type: str | None = None

    notes: str | None = None


class HRAttendanceSummary(BaseModel):

    total_days: int

    present_days: int

    absent_days: int

    leave_days: int

    half_days: int


class HRAttendanceResponse(BaseModel):

    employee_id: str

    first_name: str

    last_name: str

    records: list[HRAttendanceRecord]

    summary: HRAttendanceSummary