from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from Backend.config.Database import get_db
from Backend.schemas.user_schema import RegisterSchema
from Backend.services.auth_service import register_user_service

router = APIRouter()

@router.post("/auth/register")
def register_user(
    user: RegisterSchema,
    db: Session = Depends(get_db)
):

    return register_user_service(user, db)
