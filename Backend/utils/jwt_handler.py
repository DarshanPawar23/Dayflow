from jose import jwt, JWTError
from datetime import datetime, timedelta

from config import Config


def create_access_token(user_id: int, role: str):

    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }

    token = jwt.encode(
        payload,
        Config.SECRET_KEY,
        algorithm=Config.ALGORITHM
    )

    return token


def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            Config.SECRET_KEY,
            algorithms=[Config.ALGORITHM]
        )

        return payload

    except JWTError:
        return None