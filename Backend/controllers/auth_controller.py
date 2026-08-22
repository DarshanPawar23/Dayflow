from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from services.auth_service import Authservice
from schemas.auth_schema import SignupRequest, LoginRequest


class AuthController:

    def __init__(self):
        self.auth_service = Authservice()

    async def signup(
        self,
        db: Session,
        request: SignupRequest,
        logo: UploadFile
    ):
        try:
            return await self.auth_service.Signup(
                db,
                request,
                logo
            )

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    def login(
        self,
        db: Session,
        request: LoginRequest
    ):
        try:
            return self.auth_service.Login(
                db,
                request
            )

        except Exception as e:
            raise HTTPException(
                status_code=401,
                detail=str(e)
            )