from datetime import date, datetime

from sqlalchemy import Column, Integer, String, Date, ForeignKey, Time

from Backend.config.Database import Base
from Backend.models.user_model import User
from Backend.models.resource_model import Resource


class Booking(Base):

    __tablename__ = "booking"

    id = Column(Integer, primary_key=True, index=True)

    resource_name = Column(String(255), nullable=False)

    user_id = Column(Integer,ForeignKey("users.id"), nullable=False)

    resource_id = Column(Integer,ForeignKey("resources.id"), nullable=False)

    start_time = Column(Time, nullable=False)

    end_time = Column(Time, nullable=False)

    date = Column(Date, nullable=False)

    title = Column(String(255), nullable=False)

    status = Column(String(50), default="confirmed") 



    