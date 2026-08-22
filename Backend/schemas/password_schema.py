from pydantic import BaseModel, Field, ConfigDict, model_validator


class ChangePasswordRequest(BaseModel):

    current_password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Current or temporary password"
    )

    new_password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="New password"
    )

    confirm_password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Confirm new password"
    )

    model_config = ConfigDict(
        str_strip_whitespace=True
    )

    @model_validator(mode="after")
    def validate_passwords(self):

        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")

        if self.current_password == self.new_password:
            raise ValueError(
                "New password must be different from current password"
            )

        return self