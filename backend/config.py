from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""

    # Application
    APP_NAME: str = "AI Security Threat Detection System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "sqlite:///./security_threats.db"

    # CORS — stored as a raw string so pydantic-settings never tries to JSON-parse it.
    # Set in Render env vars as a comma-separated string:
    #   ALLOWED_ORIGINS_STR=https://your-app.vercel.app,http://localhost:3000
    ALLOWED_ORIGINS_STR: str = "http://localhost:3000,http://localhost:8000"

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS_STR.split(",") if o.strip()]

    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # API
    API_V1_PREFIX: str = "/api/v1"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
