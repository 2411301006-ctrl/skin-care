from fastapi import APIRouter, HTTPException, status, Body
from datetime import datetime
from bson import ObjectId
from app.database import get_database
from app.models.user import UserCreate, UserLogin, TokenResponse, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate):
    db = get_database()
    
    # Check existing user
    existing_user = await db.users.find_one({"email": user_in.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )
    
    now = datetime.utcnow()
    user_doc = {
        "first_name": user_in.first_name,
        "last_name": user_in.last_name,
        "email": user_in.email.lower(),
        "password_hash": get_password_hash(user_in.password),
        "role": "user",
        "subscribed_to_emails": user_in.subscribed_to_emails,
        "addresses": [],
        "wishlist_product_ids": [],
        "created_at": now,
        "updated_at": now,
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    user_doc["_id"] = user_id
    
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(**user_doc)
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_database()
    
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    user_id = str(user["_id"])
    user["_id"] = user_id
    
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(**user)
    )

@router.post("/refresh")
async def refresh_token(refresh_token: str = Body(..., embed=True)):
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    user_id = payload.get("sub")
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    new_access_token = create_access_token(user_id)
    return {"access_token": new_access_token, "token_type": "bearer"}
