from fastapi import APIRouter
from typing import List
from app.database import get_database
from app.models.category import Category

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[Category])
async def list_categories():
    db = get_database()
    cursor = db.categories.find({})
    categories = await cursor.to_list(length=100)
    for c in categories:
        c["_id"] = str(c["_id"])
    return categories
