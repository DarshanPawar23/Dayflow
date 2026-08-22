from pydantic import BaseModel, Field, ConfigDict


class PayrollGenerateRequest(BaseModel):

    user_id: int = Field(
        ...,
        gt=0
    )

    monthly_salary: float = Field(
        ...,
        gt=0
    )

    salary_month: int = Field(
        ...,
        ge=1,
        le=12
    )

    salary_year: int = Field(
        ...,
        ge=2000,
        le=2100
    )


class PayrollResponse(BaseModel):

    id: int

    user_id: int

    salary_month: int

    salary_year: int

    monthly_salary: float

    basic_salary: float

    hra: float

    other_allowances: float

    gross_salary: float

    total_working_days: int

    present_days: int

    paid_leave_days: int

    unpaid_leave_days: int

    absent_days: int

    payable_days: int

    unpaid_leave_deduction: float

    total_deductions: float

    net_salary: float

    status: str

    model_config = ConfigDict(
        from_attributes=True
    )


class PayrollEmployeeResponse(BaseModel):

    id: int

    user_id: int

    employee_id: str | None

    first_name: str

    last_name: str

    email: str

    role: str

    salary_month: int

    salary_year: int

    monthly_salary: float

    basic_salary: float

    hra: float

    other_allowances: float

    gross_salary: float

    total_working_days: int

    present_days: int

    paid_leave_days: int

    unpaid_leave_days: int

    absent_days: int

    payable_days: int

    unpaid_leave_deduction: float

    total_deductions: float

    net_salary: float

    status: str

    model_config = ConfigDict(
        from_attributes=True
    )