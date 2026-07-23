from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models import UserRole

# --- Auth Schemas ---
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, example="johndoe")
    email: EmailStr = Field(..., example="john@example.com")
    password: str = Field(..., min_length=6, example="secret123")
    role: Optional[UserRole] = Field(default=UserRole.USER, example="user")

class UserLogin(BaseModel):
    username_or_email: str = Field(..., example="johndoe")
    password: str = Field(..., example="secret123")

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Vehicle Schemas ---
class VehicleCreate(BaseModel):
    make: str = Field(..., example="Toyota")
    model: str = Field(..., example="Camry")
    category: str = Field(..., example="Sedan")
    price: float = Field(..., gt=0, example=25000.00)
    quantity: int = Field(..., ge=0, example=10)

class VehicleUpdate(BaseModel):
    make: Optional[str] = Field(None, example="Toyota")
    model: Optional[str] = Field(None, example="Camry Hybrid")
    category: Optional[str] = Field(None, example="Sedan")
    price: Optional[float] = Field(None, gt=0, example=27000.00)
    quantity: Optional[int] = Field(None, ge=0, example=15)

class VehicleResponse(BaseModel):
    id: int
    make: str
    model: str
    category: str
    price: float
    quantity: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Inventory Schemas ---
class InventoryAction(BaseModel):
    quantity: int = Field(1, gt=0, description="Quantity to purchase or restock", example=1)

class InventoryResponse(BaseModel):
    message: str
    vehicle: VehicleResponse
