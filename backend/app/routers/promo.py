from fastapi import APIRouter, HTTPException
from app.database import get_database
from app.models.promo import ValidatePromoRequest, PromoCode

router = APIRouter(prefix="/promo", tags=["Promo"])

@router.post("/validate", response_model=PromoCode)
async def validate_promo(req: ValidatePromoRequest):
    db = get_database()
    promo = await db.promo_codes.find_one({"code": req.code.upper().strip(), "active": True})
    if not promo:
        raise HTTPException(status_code=400, detail="Invalid promo code")
    promo["_id"] = str(promo["_id"])
    return PromoCode(**promo)
