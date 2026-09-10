from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routers import auth, users, categories, brands, products, reviews, cart, orders, promo

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("glow_beauty")

app = FastAPI(
    title="Glow Beauty API",
    description="Luxury Cosmetics & Skincare E-Commerce Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "app": "Glow Beauty API", "version": "1.0.0"}

# Register routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(brands.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(promo.router, prefix="/api")
