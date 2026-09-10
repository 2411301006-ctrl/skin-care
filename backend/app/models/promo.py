from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PromoCode(BaseModel):
    id: str = Field(..., alias="_id")
    code: str
    discount_type: str  # "percent" | "fixed"
    discount_value: float
    active: bool = True
    expires_at: Optional[datetime] = None

    class Config:
        populate_by_name = True

class ValidatePromoRequest(BaseModel):
    code: str
