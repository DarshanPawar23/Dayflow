from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from storage.mysql.connection import get_db
from controllers.auth_controller import AuthController
from schemas.auth_schema import SignupRequest, LoginRequest
from schemas.auth_response_schema import SignupResponse


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

controller = AuthController()


@router.post(
    "/signup",
    response_model=SignupResponse
)
async def signup(
    company_name: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    logo: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    request = SignupRequest(
        company_name=company_name,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        password=password,
        confirm_password=confirm_password
    )

    return await controller.signup(
        db,
        request,
        logo
    )


@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    return controller.login(
        db,
        request
    )