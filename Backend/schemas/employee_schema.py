from pydantic import BaseModel, EmailStr, Field, ConfigDict


class EmployeeCreateRequest(BaseModel):

    first_name: str = Field(
        ...,
        min_length=2,
        max_length=50
    )

    last_name: str = Field(
        ...,
        min_length=2,
        max_length=50
    )

    email: EmailStr

    phone: str = Field(
        ...,
        min_length=10,
        max_length=15
    )

    joining_year: int = Field(
        ...,
        ge=2000,
        le=2100
    )

    model_config = ConfigDict(
        str_strip_whitespace=True
    )