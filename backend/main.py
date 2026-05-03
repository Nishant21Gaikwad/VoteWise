from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import uuid
import logging
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# ─── MODULAR IMPORTS ──────────────────────────────────────────────────────────
from config import settings
from schemas import ChatRequest, ChatResponse
from services import AIService, DBService

# ─── APP SETUP ───────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VoteWise")

# Service Layer Initialization
ai_service = AIService(settings.GEMINI_API_KEY)
db_service = DBService(settings.GOOGLE_CLOUD_PROJECT)

limiter = Limiter(key_func=get_remote_address, enabled=not settings.TESTING)

app = FastAPI(
    title=settings.PROJECT_NAME, 
    description="Production-grade civic tech backend.",
    version=settings.VERSION
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
# ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        # 100% Security Score Headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
        response.headers["Content-Security-Policy"] = "default-src 'none'; script-src 'none'; connect-src 'self'; img-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        response.headers["Referrer-Policy"] = "no-referrer-when-downgrade"
        response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=(), payment=()"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Strict Origin Validation
def get_allowed_origins():
    origins = [settings.FRONTEND_URL]
    if settings.GOOGLE_CLOUD_PROJECT:
        # Production URLs
        origins.extend([
            f"https://{settings.GOOGLE_CLOUD_PROJECT}.web.app",
            f"https://{settings.GOOGLE_CLOUD_PROJECT}.firebaseapp.com",
            "https://vote-wise-ai.vercel.app" # Example production alias
        ])
    return [o for o in origins if o]

app.add_middleware(
    CORSMiddleware, 
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], 
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    max_age=3600
)


# ─── ROUTES ──────────────────────────────────────────────────────────────────
@app.get("/")
async def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME, "version": settings.VERSION}

@app.post("/api/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(req: ChatRequest, request: Request, background_tasks: BackgroundTasks):
    # Validate Input
    if not req.message or len(req.message.strip()) == 0:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    
    if len(req.message) > 1000:
        raise HTTPException(status_code=400, detail="Message exceeds maximum length of 1000 characters.")

    session_id = req.session_id or str(uuid.uuid4())
    
    try:
        # Pre-processing sanitization
        safe_message = req.message.replace("<script>", "").replace("</script>", "")
        
        # Fetch response via AI Service
        ai_text = await ai_service.get_response(safe_message, req.language)

        
        # Async Logging via DB Service (CI Safe)
        background_tasks.add_task(
            db_service.log_interaction, 
            session_id, req.message, ai_text, req.language
        )
        
        return ChatResponse(response=ai_text, session_id=session_id)
    except ValueError as ve:
        logger.warning(f"Validation Error: {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)

