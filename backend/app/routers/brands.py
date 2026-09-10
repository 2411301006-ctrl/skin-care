from fastapi import APIRouter
from typing import List
from app.database import get_database
from app.models.brand import Brand

router = APIRouter(prefix="/brands", tags=["Brands"])

@router.get("", response_model=List[Brand])
async def list_brands():
    db = get_database()
    cursor = db.brands.find({})
    brands = await cursor.to_list(length=100)
    for b in brands:
        b["_id"] = str(b["_id"])
    return brands
