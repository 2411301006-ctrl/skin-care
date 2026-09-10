from pydantic import BaseModel, Field
from typing import Optional

class Category(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    slug: str

    class Config:
        populate_by_name = True
