from sqlalchemy import Column, Integer, String, Enum
from Backend.config.Database import Base
import enum

class UserRole(str, enum.Enum):
    employee = "employee"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), unique=True, nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    password = Column(String(255), nullable=False)

    role = Column(Enum(UserRole), nullable=False)