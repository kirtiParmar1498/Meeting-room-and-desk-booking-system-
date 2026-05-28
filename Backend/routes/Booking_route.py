
from Backend.schemas.booking_schema import createBooking
from fastapi import APIRouter, Depends  
from sqlalchemy.orm import Session
from Backend.config.Database import get_db
from Backend.services.Booking_service import  create_booking_service,cancel_booking_service, get_all_bookings_service, get_bookings_by_user_service
from Backend.middleware.resources_middleware import admin_required, get_current_user
from Backend.models.Booking_model import Booking 

router = APIRouter( 
    prefix="/bookings",
    tags=["Bookings"]
)



@router.post("/")
def create_booking(
    booking: createBooking,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
   
    return create_booking_service(
        booking,
        current_user["user_id"],
        db
    )

@router.delete("/{booking_id}")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    
    return cancel_booking_service(
        booking_id,
        db
    )   

@router.get("/upcoming_bookings")
def get_bookings(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return get_bookings_by_user_service(
        current_user["user_id"],
        db
    )   

@router.get("/resources")
def get_all_bookings(
    db: Session = Depends(get_db),
    booking_date: str = None,
    resource_type: str = None,
    current_user: dict = Depends(admin_required)
):
    return get_all_bookings_service(
        db,
        booking_date,
        resource_type
    )



@router.get("/availability")
def check_availability(resource_id:int , date: str, db: Session = Depends(get_db)):
    """
    Returns taken and free time slots for a specific resource on a specific date.
    Date format expected: YYYY-MM-DD
    """

    business_start = "09:00"
    business_end = "17:00"


    bookings = db.query(Booking).filter(
        Booking.resource_id == resource_id,
        Booking.date == date,
        Booking.status == "confirmed" 
    ).order_by(Booking.start_time).all()

    taken_slots = []
    for b in bookings:
      
        start = b.start_time if isinstance(b.start_time, str) else b.start_time.strftime("%H:%M")
        end = b.end_time if isinstance(b.end_time, str) else b.end_time.strftime("%H:%M")
        taken_slots.append({"start_time": start, "end_time": end})

    free_slots = []
    current_time = business_start

    for slot in taken_slots:
        # If there is a gap between the current time and the start of the next booking, it's a free slot
        if current_time < slot["start_time"]:
            free_slots.append({
                "start_time": current_time, 
                "end_time": slot["start_time"]
            })
        
        current_time = max(current_time, slot["end_time"])


    if current_time < business_end:
        free_slots.append({
            "start_time": current_time, 
            "end_time": business_end
        })

    return {
        "resource_id": resource_id,
        "date": date,
        "business_hours": {"start": business_start, "end": business_end},
        "taken_slots": taken_slots,
        "free_slots": free_slots
    }