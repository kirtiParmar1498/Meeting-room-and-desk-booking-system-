from pydantic import BaseModel
from datetime import date,time 

class createBooking(BaseModel):
    resource_name: str
    resource_id: int 
    date: date      
    start_time: time
    end_time: time 
    title: str
    status :str  
