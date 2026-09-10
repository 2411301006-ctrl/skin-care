from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from app.database import get_database
from app.models.review import ReviewCreate, ReviewResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/products", tags=["Reviews"])

@router.get("/{product_id}/reviews", response_model=List[ReviewResponse])
async def get_reviews(product_id: str):
    db = get_database()
    cursor = db.reviews.find({"product_id": product_id}).sort("created_at", -1)
    reviews = await cursor.to_list(length=50)
    for r in reviews:
        r["_id"] = str(r["_id"])
    return reviews

@router.post("/{product_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    product_id: str,
    review_in: ReviewCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    
    # Check product exists
    product = None
    if ObjectId.is_valid(product_id):
        product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        product = await db.products.find_one({"slug": product_id})
        
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    p_id_str = str(product["_id"])
    
    now = datetime.utcnow()
    user_name = f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip() or "Anonymous"
    
    review_doc = {
        "product_id": p_id_str,
        "user_id": current_user["_id"],
        "user_name": user_name,
        "rating": review_in.rating,
        "comment": review_in.comment,
        "created_at": now
    }
    
    result = await db.reviews.insert_one(review_doc)
    review_doc["_id"] = str(result.inserted_id)
    
    # Update product rating_avg and rating_count
    all_reviews = await db.reviews.find({"product_id": p_id_str}).to_list(length=1000)
    count = len(all_reviews)
    avg = sum(r["rating"] for r in all_reviews) / count if count > 0 else 5.0
    
    await db.products.update_one(
        {"_id": product["_id"]},
        {"$set": {"rating_avg": round(avg, 1), "rating_count": count}}
    )
    
    return ReviewResponse(**review_doc)
