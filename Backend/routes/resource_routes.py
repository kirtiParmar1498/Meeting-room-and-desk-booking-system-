from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from Backend.config.Database import get_db

from Backend.schemas.resources_schema import CreateResource

from Backend.services.resource_service import activate_resource_service, active_resource_by_type_service, create_resource_service, deactivate_resource_service, get_resources_service, update_resource_service

from Backend.middleware.resources_middleware import admin_required, get_current_user



router = APIRouter(
    prefix="/resources",
    tags=["Resources"]
)


@router.post("/")
def create_resource(

    resource: CreateResource,

    db: Session = Depends(get_db),

    current_user: dict = Depends(admin_required)
):

    return create_resource_service(
        resource,
        db
    )

@router.put("/update/{resource_id}")
def update_resource(

    resource_id: int,

    resource: CreateResource,

    db: Session = Depends(get_db),

    current_user: dict = Depends(admin_required)
):

    return update_resource_service(
        resource_id,
        resource,
        db
    )

@router.put("/deactivate/{resource_id}")
def deactivate_resource(

    resource_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(admin_required)
):

    return deactivate_resource_service(
        resource_id,
        db
    )

@router.get("/")
def get_resources(

    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_required)
):

    return get_resources_service(
        db
    )


@router.get("/{resource_id}")
def get_all_bookings_by_date(
    resource_id: int,
    date:date ,
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_required)
):
    return get_resources_service(
        
        db
    )

@router.get("/active_resources/{resource_type}")
def get_active_resources(
    resource_type: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_required)
):
    return active_resource_by_type_service(
        resource_type,
        db
    )

@router.get("/activate_resources/all")
def get_all_Deactive_resources(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(admin_required)
):
    return activate_resource_service(
        resource_id,
        db
    )