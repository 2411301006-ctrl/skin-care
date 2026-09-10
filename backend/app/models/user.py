from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class Address(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    label: str = "Home"
    first_name: str
    last_name: str
    street_address: str
    city: str
    state: str
    zip_code: str
    is_default: bool = False

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    subscribed_to_emails: bool = False

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    subscribed_to_emails: Optional[bool] = None

class UserInDB(UserBase):
    id: str = Field(..., alias="_id")
    password_hash: str
    role: str = "user"
    addresses: List[Address] = []
    wishlist_product_ids: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class UserResponse(UserBase):
    id: str = Field(..., alias="_id")
    role: str
    addresses: List[Address] = []
    wishlist_product_ids: List[str] = []
    created_at: datetime

    class Config:
        populate_by_name = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
