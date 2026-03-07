import time
import uuid
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.photo import router as photo_router
from app.core.model_loader import load_models
from app.core.logging_config import setup_logging, get_logger
from app.core.logging_middleware import LoggingMiddleware

# -----------------------------------------
# Setup Logging Before App Starts
# -----------------------------------------
setup_logging()
logger = get_logger("main")


# -----------------------------------------
# Lifespan (Startup + Shutdown Events)
# -----------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting AI Profile Photo Validator service...")
    start_time = time.time()

    try:
        load_models()
        logger.info("RetinaFace model warm-up completed.")
    except Exception as e:
        logger.exception("Model warm-up failed.")
        raise e

    duration = round((time.time() - start_time) * 1000, 2)
    logger.info(f"Application startup completed in {duration} ms")

    yield

    # Shutdown
    logger.info("Shutting down AI Profile Photo Validator service...")


# -----------------------------------------
# FastAPI App Initialization
# -----------------------------------------
app = FastAPI(
    title="AI Profile Photo Validator",
    description="AI-powered professional profile photo validation service",
    version="1.0.0",
    lifespan=lifespan
)

# -----------------------------------------
# CORS Middleware (Allow Frontend Access)
# -----------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (update to specific domains for production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# -----------------------------------------
# Middleware (Logging)
# -----------------------------------------
app.add_middleware(LoggingMiddleware)


# -----------------------------------------
# Global Exception Handler
# -----------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error occurred: {str(exc)}")

    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal Server Error",
            "detail": "An unexpected error occurred."
        }
    )


# -----------------------------------------
# Health Check Endpoint
# -----------------------------------------
@app.get("/health")
async def health_check():
    logger.debug("Health check endpoint accessed.")
    return {
        "status": "healthy",
        "service": "AI Profile Photo Validator",
        "version": "1.0.0"
    }


# -----------------------------------------
# Version Endpoint
# -----------------------------------------
@app.get("/version")
async def version_info():
    return {
        "app": "AI Profile Photo Validator",
        "version": "1.0.0"
    }


# -----------------------------------------
# Register Routers
# -----------------------------------------
app.include_router(photo_router, prefix="/api/v1/photo", tags=["Photo Validation"])