from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Variant(BaseModel):
    variant_id: str
    label: str
    swatch_hex: Optional[str] = None
    stock_qty: int = 100

class ProductBase(BaseModel):
    name: str
    slug: str
    brand_id: str
    category_id: str
    description: str
    ingredients: str
    how_to_use: str
    price: float
    compare_at_price: Optional[float] = None
    images: List[str] = []
    is_new: bool = False
    is_bestseller: bool = False
    rating_avg: float = 5.0
    rating_count: int = 0
    variants: List[Variant] = []

class ProductResponse(ProductBase):
    id: str = Field(..., alias="_id")
    brand_name: Optional[str] = None
    category_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    pages: int
