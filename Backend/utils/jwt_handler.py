from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")


ALGORITHM = os.getenv("ALGORITHM") 

ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=30)

    to_encode.update({
        "exp": expire
    })



    token = jwt.encode(
        to_encode,
        str(SECRET_KEY),
        algorithm=ALGORITHM
    )

    return token