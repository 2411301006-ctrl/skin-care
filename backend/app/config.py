from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    MONGODB_URI: Optional[str] = None
    MONGODB_URL: Optional[str] = None
    DB_NAME: str = "glow_beauty"
    JWT_SECRET_KEY: str = "glow_beauty_super_secret_jwt_key_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    STRIPE_SECRET_KEY: str = "sk_test_mock_key"

    @property
    def get_mongodb_uri(self) -> str:
        uri = self.MONGODB_URI or self.MONGODB_URL or "mongodb://localhost:27017"
        # Auto-fix accidental double prefixes (e.g. mongodb:/mongodb+srv://)
        if "mongodb+srv://" in uri:
            uri = uri[uri.find("mongodb+srv://"):]
        elif "mongodb://" in uri:
            uri = uri[uri.find("mongodb://"):]
        return uri

    @property
    def cors_origins_list(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        return ["http://localhost:5173"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

