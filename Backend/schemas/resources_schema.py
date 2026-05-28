from pydantic import BaseModel


class CreateResource(BaseModel):

    resource_name: str

    type: str

    capacity: int

    amenities: str

    location: str

    is_Active: bool = True


class UpdateResource(BaseModel):

    resource_name: str

    type: str

    capacity: int

    amenities: str

    location: str