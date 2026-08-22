import bcrypt

from fastapi import UploadFile
from sqlalchemy.orm import Session

from storage.mysql.models.user_model import User, Company
from repositories.user_repository import AuthRepository
from schemas.auth_schema import SignupRequest, LoginRequest
from utils.file_storage import save_company_logo
from utils.jwt_handler import create_access_token


class Authservice:

    def __init__(self):
        self.authrepository = AuthRepository()

    async def Signup(
        self,
        db: Session,
        request: SignupRequest,
        logo: UploadFile
    ):

        existing_user = self.authrepository.get_user_by_email(
            db,
            request.email
        )

        if existing_user:
            raise Exception(
                "Email already registered"
            )

        existing_company = (
            self.authrepository.get_company_by_name(
                db,
                request.company_name
            )
        )

        if existing_company:
            raise Exception(
                "Company already registered"
            )

        logo_url = await save_company_logo(
            logo,
            request.company_name
        )

        company = Company(
            company_name=request.company_name,
            logo_url=logo_url
        )

        company = self.authrepository.create_company(
            db,
            company
        )

        hashed_password = bcrypt.hashpw(
            request.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        new_user = User(
            company_id=company.id,
            employee_id=None,
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            phone=request.phone,
            password_hash=hashed_password,
            role="HR",
            joining_year=None,
            must_change_password=False
        )

        user = self.authrepository.create_user(
            db,
            new_user
        )

        return {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "company_id": company.id,
            "company_name": company.company_name,
            "logo_url": company.logo_url,
            "message": "HR Signup Successful"
        }

    def Login(
        self,
        db: Session,
        request: LoginRequest
    ):

        existing_user = (
            self.authrepository.get_user_by_login_id(
                db,
                request.login_id
            )
        )

        if not existing_user:
            raise Exception(
                "Invalid login credentials"
            )

        is_valid = bcrypt.checkpw(
            request.password.encode("utf-8"),
            existing_user.password_hash.encode("utf-8")
        )

        if not is_valid:
            raise Exception(
                "Invalid login credentials"
            )

        token = create_access_token(
            existing_user.id,
            existing_user.role
        )

        return {
            "message": "Login Successful",
            "access_token": token,
            "token_type": "Bearer",
            "role": existing_user.role,
            "user_id": existing_user.id,
            "company_id": existing_user.company_id
        }