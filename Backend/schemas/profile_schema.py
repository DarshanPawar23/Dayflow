from pydantic import BaseModel, ConfigDict


class ProfileResponse(BaseModel):

    id: int
    employee_id: str | None

    first_name: str
    last_name: str

    email: str
    phone: str

    profile_image_url: str | None

    role: str
    joining_year: int | None

    company_id: int
    company_name: str
    company_logo_url: str | None

    must_change_password: bool

    model_config = ConfigDict(
        from_attributes=True
    )