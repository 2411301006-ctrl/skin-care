from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from bson import ObjectId
import math
from app.database import get_database
from app.models.product import ProductResponse, ProductListResponse

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=ProductListResponse)
async def list_products(
    category: Optional[str] = Query(None, description="Category slug or ID"),
    brand: Optional[str] = Query(None, description="Brand slug or ID"),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[str] = Query("featured"),
    is_bestseller: Optional[bool] = Query(None),
    is_new: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100)
):
    db = get_database()
    query = {}

    # Category filter
    if category:
        cat_doc = await db.categories.find_one({"$or": [{"slug": category}, {"_id": category}]})
        if cat_doc:
            query["category_id"] = str(cat_doc["_id"])
        elif ObjectId.is_valid(category):
            query["category_id"] = category

    # Brand filter
    if brand:
        brand_doc = await db.brands.find_one({"$or": [{"slug": brand}, {"_id": brand}]})
        if brand_doc:
            query["brand_id"] = str(brand_doc["_id"])
        elif ObjectId.is_valid(brand):
            query["brand_id"] = brand

    # Price range
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price

    # Bestseller / New filter
    if is_bestseller is not None:
        query["is_bestseller"] = is_bestseller
    if is_new is not None:
        query["is_new"] = is_new

    # Search filter
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]

    # Sorting
    sort_spec = [("created_at", -1)]
    if sort == "price_asc":
        sort_spec = [("price", 1)]
    elif sort == "price_desc":
        sort_spec = [("price", -1)]
    elif sort == "newest":
        sort_spec = [("created_at", -1)]
    elif sort == "featured":
        sort_spec = [("is_bestseller", -1), ("rating_avg", -1)]

    # Count total
    total = await db.products.count_documents(query)

    # Fetch paginated items
    skip = (page - 1) * limit
    cursor = db.products.find(query).sort(sort_spec).skip(skip).limit(limit)
    raw_products = await cursor.to_list(length=limit)

    # Pre-fetch categories & brands mapping
    categories_map = {}
    async for cat in db.categories.find({}):
        categories_map[str(cat["_id"])] = cat["name"]

    brands_map = {}
    async for br in db.brands.find({}):
        brands_map[str(br["_id"])] = br["name"]

    items = []
    for p in raw_products:
        p["_id"] = str(p["_id"])
        p["brand_id"] = str(p.get("brand_id", ""))
        p["category_id"] = str(p.get("category_id", ""))
        p["brand_name"] = brands_map.get(p["brand_id"], "Glow Beauty")
        p["category_name"] = categories_map.get(p["category_id"], "Cosmetics")
        items.append(ProductResponse(**p))

    pages = math.ceil(total / limit) if limit > 0 else 1

    return ProductListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )

@router.get("/{slug_or_id}", response_model=ProductResponse)
async def get_product(slug_or_id: str):
    db = get_database()
    
    query = {"$or": [{"slug": slug_or_id}]}
    if ObjectId.is_valid(slug_or_id):
        query["$or"].append({"_id": ObjectId(slug_or_id)})
        
    p = await db.products.find_one(query)
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    p["_id"] = str(p["_id"])
    p["brand_id"] = str(p.get("brand_id", ""))
    p["category_id"] = str(p.get("category_id", ""))

    # Fetch brand & category names
    if p["brand_id"] and ObjectId.is_valid(p["brand_id"]):
        brand_doc = await db.brands.find_one({"_id": ObjectId(p["brand_id"])})
        if brand_doc:
            p["brand_name"] = brand_doc["name"]
            
    if p["category_id"] and ObjectId.is_valid(p["category_id"]):
        cat_doc = await db.categories.find_one({"_id": ObjectId(p["category_id"])})
        if cat_doc:
            p["category_name"] = cat_doc["name"]

    return ProductResponse(**p)
