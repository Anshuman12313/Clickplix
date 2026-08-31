from datetime import datetime,timedelta,timezone
import jwt
from fastapi import Depends,HTTPException,status
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm
)
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from database import get_db
from models import User
from dotenv import load_dotenv
import os
load_dotenv()

SECRETKEY =os.getenv("SECRET_KEY")
ALGORITHM="HS256"

ACCESS_TOKEN_EXPIRE_MINUTES=60

password_hash=PasswordHash.recommended()
#it tells from where you will get the token you have to verify
oauth2_scheme=OAuth2PasswordBearer(
    tokenUrl="/login"
)

def hash_password(password:str):
    return password_hash.hash(password)

def verify_password(
        plain_password:str,
        hashed_password:str
):
    return password_hash.verify(
        plain_password,
        hashed_password
    )

def create_access_token(
        user_id:int
):
    expire=datetime.now(timezone.utc)+timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload={
        "sub":str(user_id),
        "exp":expire
    }
    token=jwt.encode(
        payload,
        SECRETKEY,
        algorithm=ALGORITHM
    )
    return token


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    print("========== AUTH DEBUG ==========")
    print("TOKEN RECEIVED:", token)
    print("TOKEN LENGTH:", len(token))

    try:

        payload = jwt.decode(
            token,
            SECRETKEY,
            algorithms=[ALGORITHM]
        )

        print("DECODED PAYLOAD:", payload)

        user_id = payload.get("sub")

        print("USER ID FROM TOKEN:", user_id)

        if user_id is None:
            raise credentials_exception

        user_id = int(user_id)

    except jwt.ExpiredSignatureError:
        print("TOKEN EXPIRED")
        raise credentials_exception

    except jwt.InvalidTokenError as e:
        print("INVALID TOKEN:", repr(e))
        raise credentials_exception

    except ValueError as e:
        print("INVALID USER ID:", repr(e))
        raise credentials_exception

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    print("USER FOUND:", user)

    if user is None:
        raise credentials_exception

    return user