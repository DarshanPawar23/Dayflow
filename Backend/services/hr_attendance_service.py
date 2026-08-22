from datetime import date, timedelta

from sqlalchemy.orm import Session

from repositories.hr_attendance_repository import (
    HRAttendanceRepository
)


class HRAttendanceService:

    # 4 hours = half day
    HALF_DAY_MINUTES = 240

    def __init__(self):

        self.repository = HRAttendanceRepository()

    def get_attendance_report(
        self,
        db: Session,
        current_user,
        start_date: date,
        end_date: date,
        employee_id: str | None = None
    ):

        if current_user["role"] != "HR":

            raise Exception(
                "Only HR can view employee attendance"
            )

        if start_date > end_date:

            raise Exception(
                "Start date cannot be after end date"
            )

        company_id = current_user["company_id"]

        employees = self.repository.get_company_employees(
            db,
            company_id,
            employee_id
        )

        if employee_id and not employees:

            raise Exception(
                "Employee not found"
            )

        user_ids = [
            employee.id
            for employee in employees
        ]

        attendance_records = (
            self.repository.get_attendance_records(
                db,
                user_ids,
                start_date,
                end_date
            )
        )

        leave_records = (
            self.repository.get_approved_leaves(
                db,
                user_ids,
                start_date,
                end_date
            )
        )

        attendance_map = {
            (
                record.user_id,
                record.attendance_date
            ): record
            for record in attendance_records
        }

        result = []

        current_date = start_date

        while current_date <= end_date:

            for employee in employees:

                attendance = attendance_map.get(
                    (
                        employee.id,
                        current_date
                    )
                )

                leave = self._find_leave(
                    leave_records,
                    employee.id,
                    current_date
                )

                if leave:

                    status = "LEAVE"

                    check_in_at = None
                    check_out_at = None
                    work_minutes = 0
                    extra_minutes = 0
                    notes = leave.reason

                    leave_type = (
                        leave.leave_type.value
                        if hasattr(
                            leave.leave_type,
                            "value"
                        )
                        else str(
                            leave.leave_type
                        )
                    )

                elif not attendance:

                    status = "ABSENT"

                    check_in_at = None
                    check_out_at = None
                    work_minutes = 0
                    extra_minutes = 0
                    notes = None
                    leave_type = None

                else:

                    check_in_at = attendance.check_in_at
                    check_out_at = attendance.check_out_at
                    work_minutes = attendance.work_minutes
                    extra_minutes = attendance.extra_minutes
                    notes = attendance.notes
                    leave_type = None

                    if (
                        attendance.check_in_at
                        and attendance.check_out_at
                        and attendance.work_minutes
                        < self.HALF_DAY_MINUTES
                    ):

                        status = "HALF_DAY"

                    else:

                        status = "PRESENT"

                result.append(
                    {
                        "employee_id": employee.employee_id,
                        "first_name": employee.first_name,
                        "last_name": employee.last_name,
                        "profile_image_url":
                            employee.profile_image_url,
                        "attendance_date": current_date,
                        "check_in_at": check_in_at,
                        "check_out_at": check_out_at,
                        "work_minutes": work_minutes,
                        "extra_minutes": extra_minutes,
                        "status": status,
                        "leave_type": leave_type,
                        "notes": notes
                    }
                )

            current_date += timedelta(days=1)

        if employee_id:

            return self._build_employee_response(
                employees[0],
                result
            )

        return self._build_all_employee_response(
            employees,
            result
        )

    def _find_leave(
        self,
        leave_records,
        user_id: int,
        attendance_date: date
    ):

        for leave in leave_records:

            if (
                leave.user_id == user_id
                and leave.start_date
                <= attendance_date
                <= leave.end_date
            ):

                return leave

        return None

    def _build_employee_response(
        self,
        employee,
        records
    ):

        employee_records = [
            record
            for record in records
            if record["employee_id"]
            == employee.employee_id
        ]

        return {
            "employee_id": employee.employee_id,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "records": employee_records,
            "summary": self._calculate_summary(
                employee_records
            )
        }

    def _build_all_employee_response(
        self,
        employees,
        records
    ):

        response = []

        for employee in employees:

            employee_records = [
                record
                for record in records
                if record["employee_id"]
                == employee.employee_id
            ]

            response.append(
                {
                    "employee_id":
                        employee.employee_id,
                    "first_name":
                        employee.first_name,
                    "last_name":
                        employee.last_name,
                    "records":
                        employee_records,
                    "summary":
                        self._calculate_summary(
                            employee_records
                        )
                }
            )

        return response

    def _calculate_summary(
        self,
        records
    ):

        present = 0
        absent = 0
        leave = 0
        half_day = 0

        for record in records:

            if record["status"] == "PRESENT":
                present += 1

            elif record["status"] == "ABSENT":
                absent += 1

            elif record["status"] == "LEAVE":
                leave += 1

            elif record["status"] == "HALF_DAY":
                half_day += 1

        return {
            "total_days": len(records),
            "present_days": present,
            "absent_days": absent,
            "leave_days": leave,
            "half_days": half_day
        }