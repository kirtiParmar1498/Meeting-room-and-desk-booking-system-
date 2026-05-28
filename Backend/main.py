
from fastapi import FastAPI

from Backend.config.Database import engine, Base
from Backend.routes.register_route import router as auth_router
from Backend.routes.login_route import router as login_router
from Backend.routes.resource_routes import router as resources_router
from Backend.routes.Booking_route import router as booking_router
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine) 


app.include_router(resources_router)
app.include_router(auth_router)
app.include_router(booking_router)
app.include_router(login_router)

@app.get("/")
def home():
    return {
        "message": "Booking System API Running"
    }
