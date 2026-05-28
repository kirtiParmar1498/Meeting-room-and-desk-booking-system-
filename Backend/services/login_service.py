from sqlalchemy.orm import Session
from fastapi import HTTPException

from Backend.models.user_model import User
from Backend.utils.hash_password import verify_password
from Backend.utils.jwt_handler import create_access_token


def login_user_service(user, db):

    print("Login service started")

    existing_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if not existing_user:

        print("User not found")

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    is_valid_password = verify_password(
        user.password,
        existing_user.password
    )

    if not is_valid_password:

        print("Invalid password")

        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )

    print("Password verified")

    access_token = create_access_token({
        "user_id": existing_user.id,
        "username": existing_user.username,
        "role": existing_user.role.value
    })

    print("Token created")

    return {
        "access_token": access_token,
        "role": existing_user.role.value
    }
