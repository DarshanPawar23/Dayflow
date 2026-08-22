from pydantic import BaseModel, EmailStr, Field, ConfigDict, model_validator
import re


class SignupRequest(BaseModel):
    company_name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Company name"
    )

    first_name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="HR first name"
    )

    last_name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="HR last name"
    )

    email: EmailStr = Field(
        ...,
        description="HR email address"
    )

    phone: str = Field(
        ...,
        min_length=10,
        max_length=15,
        description="HR phone number"
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="HR password"
    )

    confirm_password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Confirm HR password"
    )

    model_config = ConfigDict(
        str_strip_whitespace=True
    )

    @model_validator(mode="after")
    def validate_signup(self):
        if not re.fullmatch(r"^\+?[0-9]{10,15}$", self.phone):
            raise ValueError("Invalid phone number")

        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")

        return self


class LoginRequest(BaseModel):
    login_id: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Registered email or employee ID"
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Account password"
    )

    model_config = ConfigDict(
        str_strip_whitespace=True
    )