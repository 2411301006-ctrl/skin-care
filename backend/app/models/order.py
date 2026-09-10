from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.models.user import Address

class OrderItem(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    name: str
    variant_label: Optional[str] = None
    quantity: int
    price: float
    image: Optional[str] = None

class CreateOrderRequest(BaseModel):
    shipping_address: Address
    payment_method: str = "credit_card"  # credit_card | paypal | apple_pay
    promo_code: Optional[str] = None

class OrderResponse(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    items: List[OrderItem]
    shipping_address: Address
    payment_method: str
    payment_status: str  # pending | paid | failed
    subtotal: float
    shipping_cost: float
    tax: float
    total: float
    promo_code: Optional[str] = None
    order_status: str  # pending | processing | shipped | delivered | cancelled
    created_at: datetime

    class Config:
        populate_by_name = True
