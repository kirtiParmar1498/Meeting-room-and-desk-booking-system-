from sqlalchemy import Column, Integer, String , Boolean

from Backend.config.Database import Base


class Resource(Base):

    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)

    resource_name = Column(String(255), unique=True, nullable=False)

    type = Column(String(255), nullable=False)

    capacity = Column(Integer, nullable=False)

    amenities = Column(String(255), nullable=True)

    location = Column(String(255), nullable=True)
    
    IsActive = Column(Boolean, default=True)