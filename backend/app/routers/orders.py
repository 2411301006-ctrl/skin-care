from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.database import get_database
from app.models.order import CreateOrderRequest, OrderResponse, OrderItem
from app.core.dependencies import get_current_user
from app.routers.cart import get_or_create_cart, populate_cart_response

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: CreateOrderRequest,
    current_user: dict = Depends(get_current_user),
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    db = get_database()
    cart = await get_or_create_cart(current_user, x_session_id)
    cart_populated = await populate_cart_response(cart)

    if not cart_populated.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order_items = []
    for item in cart_populated.items:
        order_items.append(OrderItem(
            product_id=item.product_id,
            variant_id=item.variant_id,
            name=item.name,
            variant_label=item.variant_label,
            quantity=item.quantity,
            price=item.current_price,
            image=item.image
        ).model_dump())

    subtotal = cart_populated.subtotal
    promo_code = order_in.promo_code or cart_populated.promo_code
    discount = cart_populated.discount_amount

    # Free shipping on orders over $50 after discount
    discounted_subtotal = max(0.0, subtotal - discount)
    shipping_cost = 0.0 if discounted_subtotal >= 50.0 else 10.0
    tax = 0.0
    total = round(discounted_subtotal + shipping_cost + tax, 2)

    now = datetime.utcnow()
    order_doc = {
        "user_id": current_user["_id"],
        "items": order_items,
        "shipping_address": order_in.shipping_address.model_dump(),
        "payment_method": order_in.payment_method,
        "payment_status": "paid",  # Mocked as successful
        "subtotal": subtotal,
        "shipping_cost": shipping_cost,
        "tax": tax,
        "total": total,
        "promo_code": promo_code,
        "order_status": "processing",
        "created_at": now
    }

    result = await db.orders.insert_one(order_doc)
    order_doc["_id"] = str(result.inserted_id)

    # Empty the cart
    await db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": [], "promo_code": None, "updated_at": now}}
    )

    return OrderResponse(**order_doc)

@router.get("", response_model=List[OrderResponse])
async def list_user_orders(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.orders.find({"user_id": current_user["_id"]}).sort("created_at", -1)
    raw_orders = await cursor.to_list(length=100)
    
    orders = []
    for o in raw_orders:
        o["_id"] = str(o["_id"])
        orders.append(OrderResponse(**o))
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid order ID")

    order = await db.orders.find_one({
        "_id": ObjectId(order_id),
        "user_id": current_user["_id"]
    })
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order["_id"] = str(order["_id"])
    return OrderResponse(**order)
