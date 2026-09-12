from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from backend.config import settings
from backend.database import engine, Base
from backend.routers import threats
try:
    from backend.routers import live_monitoring as live_monitoring_router
    _LIVE_MONITORING_AVAILABLE = True
except Exception as _lm_import_err:
    import logging as _lm_log
    _lm_log.getLogger(__name__).warning(
        "Live monitoring module failed to load (existing app unaffected): %s", _lm_import_err
    )
    _LIVE_MONITORING_AVAILABLE = False

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting AI Security Threat Detection System")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    yield
    # Shutdown
    logger.info("Shutting down application")


app = FastAPI(
    title="AI Security Threat Detection System",
    description="Self-evolving security ecosystem for autonomous threat detection and response",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(threats.router, prefix="/api/v1/threats", tags=["threats"])

# Live monitoring router — additive only, wrapped in try/except for safety
if _LIVE_MONITORING_AVAILABLE:
    app.include_router(
        live_monitoring_router.router,
        prefix="/api/live-monitoring",
        tags=["live-monitoring"],
    )


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Security Threat Detection System API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
