from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class UserRole(str, Enum):
    employee = "employee"
    admin = "admin"

class RegisterSchema(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(
        ...,
        min_length=6,
        max_length=72
    )
    role: UserRole