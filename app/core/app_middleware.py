# app/middleware/app_middleware.py

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

def add_cors_middleware(app: FastAPI):
    # Add CORS middleware to allow requests from specific origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins for development (adjust for production)
        allow_credentials=True,
        allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE)
        allow_headers=["*"],  # Allow all headers
    )