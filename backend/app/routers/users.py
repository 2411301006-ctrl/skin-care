from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List
from bson import ObjectId
from datetime import datetime
from app.database import get_database
from app.models.user import UserResponse, UserUpdate, Address
from app.models.product import ProductResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

@router.put("/me", response_model=UserResponse)
async def update_me(update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if update_dict:
        update_dict["updated_at"] = datetime.utcnow()
        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$set": update_dict}
        )
        current_user.update(update_dict)
    
    return UserResponse(**current_user)

@router.get("/me/addresses", response_model=List[Address])
async def get_addresses(current_user: dict = Depends(get_current_user)):
    return current_user.get("addresses", [])

@router.post("/me/addresses", response_model=List[Address])
async def add_address(address: Address, current_user: dict = Depends(get_current_user)):
    db = get_database()
    addresses = current_user.get("addresses", [])
    
    new_addr = address.model_dump()
    new_addr["_id"] = str(ObjectId())
    
    if new_addr.get("is_default"):
        for a in addresses:
            a["is_default"] = False
    
    addresses.append(new_addr)
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"addresses": addresses, "updated_at": datetime.utcnow()}}
    )
    return addresses

@router.put("/me/addresses/{address_id}", response_model=List[Address])
async def update_address(address_id: str, address: Address, current_user: dict = Depends(get_current_user)):
    db = get_database()
    addresses = current_user.get("addresses", [])
    
    found = False
    for i, a in enumerate(addresses):
        if a.get("_id") == address_id or a.get("id") == address_id:
            updated_addr = address.model_dump()
            updated_addr["_id"] = address_id
            addresses[i] = updated_addr
            found = True
            break
            
    if not found:
        raise HTTPException(status_code=404, detail="Address not found")
        
    if address.is_default:
        for a in addresses:
            if a.get("_id") != address_id:
                a["is_default"] = False
                
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"addresses": addresses, "updated_at": datetime.utcnow()}}
    )
    return addresses

@router.delete("/me/addresses/{address_id}", response_model=List[Address])
async def delete_address(address_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    addresses = current_user.get("addresses", [])
    
    addresses = [a for a in addresses if a.get("_id") != address_id and a.get("id") != address_id]
    
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"addresses": addresses, "updated_at": datetime.utcnow()}}
    )
    return addresses

@router.get("/me/wishlist", response_model=List[ProductResponse])
async def get_wishlist(current_user: dict = Depends(get_current_user)):
    db = get_database()
    wishlist_ids = current_user.get("wishlist_product_ids", [])
    
    if not wishlist_ids:
        return []
        
    obj_ids = []
    for pid in wishlist_ids:
        try:
            obj_ids.append(ObjectId(pid))
        except Exception:
            pass
            
    cursor = db.products.find({"_id": {"$in": obj_ids}})
    products = await cursor.to_list(length=100)
    
    # Enrich with brand/category names
    for p in products:
        p["_id"] = str(p["_id"])
        p["brand_id"] = str(p.get("brand_id", ""))
        p["category_id"] = str(p.get("category_id", ""))
        
    return products

@router.post("/me/wishlist/{product_id}")
async def add_to_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    wishlist_ids = current_user.get("wishlist_product_ids", [])
    
    if product_id not in wishlist_ids:
        wishlist_ids.append(product_id)
        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$set": {"wishlist_product_ids": wishlist_ids, "updated_at": datetime.utcnow()}}
        )
    return {"message": "Added to wishlist", "wishlist_product_ids": wishlist_ids}

@router.delete("/me/wishlist/{product_id}")
async def remove_from_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    wishlist_ids = current_user.get("wishlist_product_ids", [])
    
    if product_id in wishlist_ids:
        wishlist_ids.remove(product_id)
        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$set": {"wishlist_product_ids": wishlist_ids, "updated_at": datetime.utcnow()}}
        )
    return {"message": "Removed from wishlist", "wishlist_product_ids": wishlist_ids}
