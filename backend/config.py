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

    # AWS S3 Settings for Malicious Activity Archival
    S3_BUCKET: str = "shield-ai-threat-archive"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    S3_LOCAL_FALLBACK_DIR: str = "./s3_archive"

    # Sensor Ingestion Security
    SENSOR_API_KEY: str = "shield-sensor-secret-key"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"


settings = Settings()
