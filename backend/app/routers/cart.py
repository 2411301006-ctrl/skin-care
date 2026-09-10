from fastapi import APIRouter, Depends, Header, HTTPException, status
from typing import Optional
from datetime import datetime
from bson import ObjectId
from app.database import get_database
from app.models.cart import CartResponse, CartItemPopulated, CartAddRequest, CartUpdateRequest
from app.core.dependencies import get_current_user_optional

router = APIRouter(prefix="/cart", tags=["Cart"])

async def get_or_create_cart(user: Optional[dict], session_id: Optional[str]):
    db = get_database()
    cart = None
    
    if user:
        cart = await db.carts.find_one({"user_id": user["_id"]})
        # If user has no cart, but session_id is provided, claim the session cart!
        if not cart and session_id:
            cart = await db.carts.find_one({"session_id": session_id})
            if cart:
                await db.carts.update_one(
                    {"_id": cart["_id"]},
                    {"$set": {"user_id": user["_id"], "updated_at": datetime.utcnow()}}
                )
                cart["user_id"] = user["_id"]
    elif session_id:
        cart = await db.carts.find_one({"session_id": session_id, "user_id": None})
        
    if not cart:
        new_cart = {
            "user_id": user["_id"] if user else None,
            "session_id": session_id if not user else None,
            "items": [],
            "promo_code": None,
            "updated_at": datetime.utcnow()
        }
        res = await db.carts.insert_one(new_cart)
        new_cart["_id"] = res.inserted_id
        cart = new_cart

    return cart

async def populate_cart_response(cart: dict) -> CartResponse:
    db = get_database()
    populated_items = []
    subtotal = 0.0

    for item in cart.get("items", []):
        pid = item.get("product_id")
        product = None
        if ObjectId.is_valid(pid):
            product = await db.products.find_one({"_id": ObjectId(pid)})
            
        if not product:
            continue
            
        var_label = None
        current_price = product.get("price", 0.0)
        
        # Match variant label if selected
        if item.get("variant_id"):
            for v in product.get("variants", []):
                if v.get("variant_id") == item.get("variant_id"):
                    var_label = v.get("label")
                    break
                    
        # Brand name
        brand_name = None
        brand_id = product.get("brand_id")
        if brand_id and ObjectId.is_valid(brand_id):
            b_doc = await db.brands.find_one({"_id": ObjectId(brand_id)})
            if b_doc:
                brand_name = b_doc["name"]

        image = product.get("images", [None])[0] if product.get("images") else None
        
        line_total = current_price * item.get("quantity", 1)
        subtotal += line_total

        populated_items.append(CartItemPopulated(
            product_id=str(product["_id"]),
            variant_id=item.get("variant_id"),
            quantity=item.get("quantity", 1),
            price_at_add=item.get("price_at_add", current_price),
            name=product.get("name", "Product"),
            brand_name=brand_name,
            image=image,
            variant_label=var_label,
            current_price=current_price
        ))

    # Calculate discount if promo_code is present
    discount_amount = 0.0
    promo_code = cart.get("promo_code")
    if promo_code:
        promo = await db.promo_codes.find_one({"code": promo_code.upper(), "active": True})
        if promo:
            if promo.get("discount_type") == "percent":
                discount_amount = round(subtotal * (promo.get("discount_value", 0) / 100.0), 2)
            elif promo.get("discount_type") == "fixed":
                discount_amount = min(subtotal, promo.get("discount_value", 0))

    total = max(0.0, round(subtotal - discount_amount, 2))

    return CartResponse(
        id=str(cart["_id"]),
        items=populated_items,
        promo_code=promo_code,
        discount_amount=discount_amount,
        subtotal=round(subtotal, 2),
        total=total
    )

@router.get("", response_model=CartResponse)
async def get_cart(
    current_user: Optional[dict] = Depends(get_current_user_optional),
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    cart = await get_or_create_cart(current_user, x_session_id)
    return await populate_cart_response(cart)

@router.post("/items", response_model=CartResponse)
async def add_item_to_cart(
    item_in: CartAddRequest,
    current_user: Optional[dict] = Depends(get_current_user_optional),
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    db = get_database()
    
    # Check product exists & validate stock
    if not ObjectId.is_valid(item_in.product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
        
    product = await db.products.find_one({"_id": ObjectId(item_in.product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = await get_or_create_cart(current_user, x_session_id)
    items = cart.get("items", [])

    # Check if item with same product_id and variant_id already in cart
    found = False
    for item in items:
        if item.get("product_id") == item_in.product_id and item.get("variant_id") == item_in.variant_id:
            item["quantity"] += item_in.quantity
            found = True
            break

    if not found:
        items.append({
            "product_id": item_in.product_id,
            "variant_id": item_in.variant_id,
            "quantity": item_in.quantity,
            "price_at_add": product.get("price", 0.0)
        })

    await db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": items, "updated_at": datetime.utcnow()}}
    )
    cart["items"] = items

    return await populate_cart_response(cart)

@router.put("/items/{product_id}", response_model=CartResponse)
async def update_item_quantity(
    product_id: str,
    update_in: CartUpdateRequest,
    variant_id: Optional[str] = Query(None),
    current_user: Optional[dict] = Depends(get_current_user_optional),
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    db = get_database()
    cart = await get_or_create_cart(current_user, x_session_id)
    items = cart.get("items", [])

    if update_in.quantity <= 0:
        items = [i for i in items if not (i.get("product_id") == product_id and (variant_id is None or i.get("variant_id") == variant_id))]
    else:
        for item in items:
            if item.get("product_id") == product_id and (variant_id is None or item.get("variant_id") == variant_id):
                item["quantity"] = update_in.quantity
                break

    await db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": items, "updated_at": datetime.utcnow()}}
    )
    cart["items"] = items

    return await populate_cart_response(cart)

@router.delete("/items/{product_id}", response_model=CartResponse)
async def remove_item_from_cart(
    product_id: str,
    variant_id: Optional[str] = Query(None),
    current_user: Optional[dict] = Depends(get_current_user_optional),
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    db = get_database()
    cart = await get_or_create_cart(current_user, x_session_id)
    items = cart.get("items", [])

    items = [i for i in items if not (i.get("product_id") == product_id and (variant_id is None or i.get("variant_id") == variant_id))]

    await db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": items, "updated_at": datetime.utcnow()}}
    )
    cart["items"] = items

    return await populate_cart_response(cart)

@router.post("/promo", response_model=CartResponse)
async def apply_promo_code(
    code: str = Body(..., embed=True),
    current_user: Optional[dict] = Depends(get_current_user_optional),
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    db = get_database()
    promo = await db.promo_codes.find_one({"code": code.upper().strip(), "active": True})
    if not promo:
        raise HTTPException(status_code=400, detail="Invalid or expired promo code")

    cart = await get_or_create_cart(current_user, x_session_id)
    await db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"promo_code": code.upper().strip(), "updated_at": datetime.utcnow()}}
    )
    cart["promo_code"] = code.upper().strip()

    return await populate_cart_response(cart)
