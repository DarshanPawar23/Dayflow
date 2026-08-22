from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EmployeeUpdateRequest(BaseModel):

    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    phone: str | None = None
    joining_year: int | None = None


class EmployeeResponse(BaseModel):

    id: int
    employee_id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    profile_image_url: str | None
    role: str
    joining_year: int | None
    company_id: int
    must_change_password: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )