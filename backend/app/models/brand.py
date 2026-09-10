from pydantic import BaseModel, Field

class Brand(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    slug: str

    class Config:
        populate_by_name = True
