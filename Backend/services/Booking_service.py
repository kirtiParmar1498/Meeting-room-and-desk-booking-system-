from datetime import datetime

from fastapi import HTTPException
# from sqlalchemy.orm import Session

from Backend.models.Booking_model import Booking 
from Backend.models.resource_model import Resource
  

def create_booking_service(
    booking,
    user_id,
    db 
):  
    
    try:

        business_start = "09:00"
        business_end = "17:00"

        if booking.start_time < business_start or booking.end_time > business_end:
            raise HTTPException(
                status_code=400,
                detail="Start time must be within business hours"
            )

        if booking.end_time <= booking.start_time or booking.start_time < business_start or booking.end_time > business_end:
            raise HTTPException(
                status_code=400,
                detail="end_time must be after start_time "
            )
        
       
        current_time = datetime.now().time()
        if booking.date == datetime.now().date() and booking.start_time < current_time:
            raise HTTPException(
                status_code=400,
                detail="Start time must be in the future"
            )
        
        if booking.date == datetime.now().date() and booking.end_time < current_time:
            raise HTTPException(
                status_code=400,
                detail="End time must be in the future"
            )
        
        resource = db.query(Resource).filter(Resource.id == booking.resource_id).with_for_update().first()
        
        overlapping_booking = db.query(Booking).filter(
        Booking.resource_id == booking.resource_id,
        Booking.date == booking.date,
        Booking.status == "confirmed",
        Booking.start_time < booking.end_time,
        Booking.end_time > booking.start_time
        ).first()

        if overlapping_booking:
          raise HTTPException(
            status_code=400,
            detail="Resource is already booked for the selected time slot"
        )

        new_booking = Booking(

        user_id=user_id,

        resource_id=booking.resource_id,

        resource_name=booking.resource_name,

        date=booking.date,

        start_time=booking.start_time,

        end_time=booking.end_time,

        title=booking.title,

        status= "confirmed"

        )
        
        db.add(new_booking)

        db.commit()

        db.refresh(new_booking)

        return {
        "message": "Booking created successfully",
        "booking": new_booking
         }
    except Exception as e:
     db.rollback()
     if isinstance(e, HTTPException):
      raise e
     raise HTTPException(status_code=500, detail=str(e))
    

def cancel_booking_service(
    booking_id,
    db
):
    try:
        existing_booking = db.query(Booking).filter(Booking.id == booking_id).first()

        if not existing_booking:
            raise HTTPException(
                status_code=404,
                detail="Booking not found"
            )

        existing_booking.status = "cancelled" 
        

        db.commit()

        db.refresh(existing_booking)

        return {
            "message": "Booking cancelled successfully",
            "booking": existing_booking
        }
    except Exception as e:
     db.rollback()
     if isinstance(e, HTTPException):
      raise e
     raise HTTPException(status_code=500, detail=str(e))
    

def get_bookings_by_user_service(
    user_id,
    db
):
    try:
        bookings = db.query(Booking).filter(Booking.user_id == user_id).all()

        return {
            "bookings": bookings
        }
    except Exception as e:
     raise HTTPException(status_code=500, detail=str(e))
    
def get_all_bookings_service(
    db,
    booking_date: str = None,
    resource_type: str = None
):
    try:

        query = db.query(Booking, Resource).join(
            Resource,
            Booking.resource_id == Resource.id
        )

       
        if booking_date:
            query = query.filter(
                Booking.date == booking_date
            )

    
        if resource_type and resource_type.lower() not in ("all", "any"):
            query = query.filter(
                Resource.type == resource_type
            )

        rows = query.all()

        bookings = []

        for booking, resource in rows:
            bookings.append({
                "id": booking.id,
                "title": booking.title,
                "user_id": booking.user_id,
                "resource_id": booking.resource_id,
                "resource_name": booking.resource_name,
                "resource_type": resource.type,
                "date": booking.date,
                "start_time": booking.start_time,
                "end_time": booking.end_time,
                "status": booking.status,
            })

        return {
            "bookings": bookings
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
