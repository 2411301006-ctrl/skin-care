from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CartItem(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int = 1
    price_at_add: float

class CartItemPopulated(CartItem):
    name: str
    brand_name: Optional[str] = None
    image: Optional[str] = None
    variant_label: Optional[str] = None
    current_price: float

class Cart(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    items: List[CartItem] = []
    promo_code: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class CartResponse(BaseModel):
    id: str = Field(..., alias="_id")
    items: List[CartItemPopulated] = []
    promo_code: Optional[str] = None
    discount_amount: float = 0.0
    subtotal: float = 0.0
    total: float = 0.0

    class Config:
        populate_by_name = True

class CartAddRequest(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int = 1

class CartUpdateRequest(BaseModel):
    quantity: int
