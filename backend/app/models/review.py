from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str

class ReviewResponse(BaseModel):
    id: str = Field(..., alias="_id")
    product_id: str
    user_id: str
    user_name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        populate_by_name = True
