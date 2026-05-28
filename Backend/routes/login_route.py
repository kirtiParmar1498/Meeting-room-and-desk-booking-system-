from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Backend.config.Database  import get_db
from Backend.schemas.login_schema import LoginUser
from Backend.services.login_service import login_user_service

router = APIRouter()


@router.post("/auth/login")
def login_user(
    user: LoginUser,
    db: Session = Depends(get_db)
):

    try:

        print("Route called")

        return login_user_service(
            user,
            db
        )

    except Exception as e:

        print("ERROR =", e)

        return {
            "error": str(e)
        }