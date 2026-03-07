import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging_config import get_logger

logger = get_logger("request_logger")


class LoggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        start_time = time.time()

        logger.info(f"[{request_id}] Incoming request: {request.method} {request.url}")

        try:
            response = await call_next(request)

            duration = round((time.time() - start_time) * 1000, 2)

            logger.info(
                f"[{request_id}] Completed in {duration}ms | Status: {response.status_code}"
            )

            response.headers["X-Request-ID"] = request_id
            return response

        except Exception as e:
            logger.exception(f"[{request_id}] Unhandled exception: {str(e)}")
            raise e