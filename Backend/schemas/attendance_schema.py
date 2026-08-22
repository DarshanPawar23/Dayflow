from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from storage.mysql.models.attendance_model import AttendanceStatus


class AttendanceResponse(BaseModel):

    id: int
    attendance_date: date

    check_in_at: datetime | None
    check_out_at: datetime | None

    status: AttendanceStatus

    work_minutes: int
    extra_minutes: int

    work_hours: str
    extra_hours: str

    notes: str | None

    model_config = ConfigDict(
        from_attributes=True
    )


class AttendanceActionResponse(BaseModel):

    message: str
    attendance: AttendanceResponse


class AttendanceSummaryResponse(BaseModel):

    month: int
    year: int

    present_days: int
    leave_days: int
    total_working_days: int

    total_work_minutes: int
    total_extra_minutes: int

    total_work_hours: str
    total_extra_hours: str