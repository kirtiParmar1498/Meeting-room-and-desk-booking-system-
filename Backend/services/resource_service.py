from fastapi import HTTPException

from ..models.resource_model import Resource


def create_resource_service(
    resource,
    db
):

    new_resource = Resource(

        resource_name=resource.resource_name,

        type=resource.type,

        capacity=resource.capacity,

        amenities=resource.amenities,

        location=resource.location
    )

    db.add(new_resource)

    db.commit()

    db.refresh(new_resource)

    return {
        "message": "Resource created successfully",
        "resource": new_resource
    }

def update_resource_service(
    resource_id,
    resource,
    db
):
  
    existing_resource = db.query(Resource).filter(Resource.id == resource_id).first()

    if not existing_resource:
        return {
            "error": "Resource not found"
        }
    if  resource.resource_name is not None:
     existing_resource.resource_name = resource.resource_name
    if resource.type is not None:
     existing_resource.type = resource.type
    if resource.capacity is not None:
        existing_resource.capacity = resource.capacity
    if resource.amenities is not None:
     existing_resource.amenities = resource.amenities
    if resource.location is not None:
     existing_resource.location = resource.location

    db.commit()

    db.refresh(existing_resource)

    return {
        "message": "Resource updated successfully",
        "resource": existing_resource
    }
    
   

def deactivate_resource_service(
    resource_id,
    db
):

    existing_resource = db.query(Resource).filter(Resource.id == resource_id).first()

    if not existing_resource:
        return {
            "error": "Resource not found"
        }

    existing_resource.IsActive = False

    db.commit()

    db.refresh(existing_resource)

    return {
        "message": "Resource deactivated successfully",
        "resource": existing_resource
    }


def get_resources_service(
    db
):

    resources = db.query(Resource).filter(Resource.IsActive == True)

    return resources.all()


def  active_resource_by_type_service(
    resource_type,
    db
):
    try:
        query = db.query(Resource).filter(Resource.IsActive == True)

        if resource_type and resource_type.lower() not in ("all", "any"):
            query = query.filter(Resource.type == resource_type)

        active_resources = query.all()

        return {
            "active_resources": active_resources
        }
    except Exception as e:
     raise HTTPException(status_code=500, detail=str(e)) 

def activate_resource_service(
    resource_id,
    db
):

    existing_resource = db.query(Resource).filter(Resource.id == resource_id).first()

    if not existing_resource:
        return {
            "error": "Resource not found"
        }

    existing_resource.IsActive = True

    db.commit()

    db.refresh(existing_resource)

    return {
        "message": "Resource activated successfully",
        "resource": existing_resource
    }