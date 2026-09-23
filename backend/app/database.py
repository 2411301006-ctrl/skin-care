from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None

db = Database()

def get_database():
    return db.client[settings.DB_NAME]

async def connect_to_mongo():
    uri = settings.get_mongodb_uri
    # Hide password in logs for security
    safe_log_uri = uri.split("@")[-1] if "@" in uri else uri
    logger.info(f"Connecting to MongoDB at ...@{safe_log_uri}...")
    db.client = AsyncIOMotorClient(uri)
    # Test connection
    try:
        await db.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB instance: {e}")

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed.")
