import calendar

from datetime import date

from sqlalchemy.orm import Session

from repositories.payroll_repository import PayrollRepository

from storage.mysql.models.payroll_model import (
    Payroll,
    PayrollStatus
)


class PayrollService:

    BASIC_PERCENTAGE = 0.50

    HRA_PERCENTAGE = 0.20

    OTHER_ALLOWANCE_PERCENTAGE = 0.30

    def __init__(self):

        self.payroll_repository = PayrollRepository()

    def get_month_dates(
        self,
        year: int,
        month: int
    ):

        start_date = date(
            year,
            month,
            1
        )

        last_day = calendar.monthrange(
            year,
            month
        )[1]

        end_date = date(
            year,
            month,
            last_day
        )

        return start_date, end_date

    def calculate_working_days(
        self,
        start_date: date,
        end_date: date
    ):

        working_days = 0

        current_date = start_date

        while current_date <= end_date:

            if current_date.weekday() < 5:
                working_days += 1

            current_date = (
                current_date.fromordinal(
                    current_date.toordinal() + 1
                )
            )

        return working_days

    def calculate_leave_days(
        self,
        leaves,
        start_date: date,
        end_date: date,
        leave_type: str
    ):

        total_days = 0

        for leave in leaves:

            if leave.leave_type.value != leave_type:
                continue

            leave_start = max(
                leave.start_date,
                start_date
            )

            leave_end = min(
                leave.end_date,
                end_date
            )

            if leave_start <= leave_end:

                total_days += (
                    leave_end - leave_start
                ).days + 1

        return total_days

    def generate_payroll(
        self,
        db: Session,
        current_user,
        user_id: int,
        monthly_salary: float,
        salary_month: int,
        salary_year: int
    ):

        if current_user["role"] != "HR":

            raise Exception(
                "Only HR can generate payroll"
            )

        company_id = current_user["company_id"]

        employee = (
            self.payroll_repository.get_employee_by_company(
                db,
                user_id,
                company_id
            )
        )

        if not employee:

            raise Exception(
                "Employee not found in your company"
            )

        existing_payroll = (
            self.payroll_repository.get_payroll(
                db,
                user_id,
                salary_month,
                salary_year
            )
        )

        if existing_payroll:

            raise Exception(
                "Payroll already generated for this employee and month"
            )

        start_date, end_date = (
            self.get_month_dates(
                salary_year,
                salary_month
            )
        )

        total_working_days = (
            self.calculate_working_days(
                start_date,
                end_date
            )
        )

        attendance_records = (
            self.payroll_repository.get_attendance_records(
                db,
                user_id,
                start_date,
                end_date
            )
        )

        approved_leaves = (
            self.payroll_repository.get_approved_leaves(
                db,
                user_id,
                start_date,
                end_date
            )
        )

        present_days = len({
            attendance.attendance_date
            for attendance in attendance_records
            if attendance.check_in_at
        })

        paid_leave_days = (
            self.calculate_leave_days(
                approved_leaves,
                start_date,
                end_date,
                "PAID"
            )
        )

        unpaid_leave_days = (
            self.calculate_leave_days(
                approved_leaves,
                start_date,
                end_date,
                "UNPAID"
            )
        )

        sick_leave_days = (
            self.calculate_leave_days(
                approved_leaves,
                start_date,
                end_date,
                "SICK"
            )
        )

        paid_days = (
            present_days
            + paid_leave_days
            + sick_leave_days
        )

        absent_days = max(
            0,
            total_working_days
            - paid_days
            - unpaid_leave_days
        )

        payable_days = (
            paid_days
        )

        basic_salary = (
            monthly_salary
            * self.BASIC_PERCENTAGE
        )

        hra = (
            monthly_salary
            * self.HRA_PERCENTAGE
        )

        other_allowances = (
            monthly_salary
            * self.OTHER_ALLOWANCE_PERCENTAGE
        )

        gross_salary = (
            basic_salary
            + hra
            + other_allowances
        )

        daily_salary = (
            monthly_salary
            / total_working_days
            if total_working_days > 0
            else 0
        )

        unpaid_leave_deduction = (
            daily_salary
            * (
                unpaid_leave_days
                + absent_days
            )
        )

        total_deductions = (
            unpaid_leave_deduction
        )

        net_salary = max(
            0,
            gross_salary - total_deductions
        )

        payroll = Payroll(

            user_id=employee.id,

            salary_month=salary_month,

            salary_year=salary_year,

            monthly_salary=round(
                monthly_salary,
                2
            ),

            basic_salary=round(
                basic_salary,
                2
            ),

            hra=round(
                hra,
                2
            ),

            other_allowances=round(
                other_allowances,
                2
            ),

            gross_salary=round(
                gross_salary,
                2
            ),

            total_working_days=(
                total_working_days
            ),

            present_days=present_days,

            paid_leave_days=(
                paid_leave_days
                + sick_leave_days
            ),

            unpaid_leave_days=(
                unpaid_leave_days
            ),

            absent_days=absent_days,

            payable_days=payable_days,

            unpaid_leave_deduction=round(
                unpaid_leave_deduction,
                2
            ),

            total_deductions=round(
                total_deductions,
                2
            ),

            net_salary=round(
                net_salary,
                2
            ),

            status=PayrollStatus.GENERATED
        )

        return (
            self.payroll_repository.create_payroll(
                db,
                payroll
            )
        )

    def get_my_payrolls(
        self,
        db: Session,
        current_user
    ):

        user_id = current_user["user_id"]

        payrolls = (
            self.payroll_repository.get_employee_payrolls(
                db,
                user_id
            )
        )

        return payrolls

    def get_my_payroll(
        self,
        db: Session,
        current_user,
        month: int,
        year: int
    ):

        payroll = (
            self.payroll_repository.get_payroll(
                db,
                current_user["user_id"],
                month,
                year
            )
        )

        if not payroll:

            raise Exception(
                "Payroll not found"
            )

        return payroll

    def get_company_payrolls(
        self,
        db: Session,
        current_user
    ):

        if current_user["role"] != "HR":

            raise Exception(
                "Only HR can view company payroll"
            )

        return (
            self.payroll_repository.get_company_payrolls(
                db,
                current_user["company_id"]
            )
        )