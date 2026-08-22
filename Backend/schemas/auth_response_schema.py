from pydantic import BaseModel

class SignupResponse(BaseModel):
    id: int
    email: str
    message: str

