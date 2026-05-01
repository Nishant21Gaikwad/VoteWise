from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import os
import uuid
import logging
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# ─── MODULAR IMPORTS ──────────────────────────────────────────────────────────
# Using robust local imports for CI compatibility
try:
    from schemas import ChatRequest, ChatResponse
    from services import AIService, DBService
except ImportError:
    from .schemas import ChatRequest, ChatResponse
    from .services import AIService, DBService

# ─── APP SETUP ───────────────────────────────────────────────────────────────
load_dotenv()
logging.basicConfig(level=logging.INFO)

# Service Layer Initialization
ai_service = AIService(os.getenv("GEMINI_API_KEY"))
db_service = DBService(os.getenv("GOOGLE_CLOUD_PROJECT"))

is_testing = os.getenv("TESTING", "false").lower() == "true"
limiter = Limiter(key_func=get_remote_address, enabled=not is_testing)

app = FastAPI(
    title="VoteWise API", 
    description="Production-grade civic tech backend.",
    version="2.1.1"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["GET", "POST", "OPTIONS"], 
    allow_headers=["Content-Type"]
)

# ─── ROUTES ──────────────────────────────────────────────────────────────────
@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "VoteWise AI", "version": "2.1.1"}

@app.post("/api/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(req: ChatRequest, request: Request, background_tasks: BackgroundTasks):
    session_id = req.session_id or str(uuid.uuid4())
    
    try:
        # Fetch response via AI Service
        ai_text = await ai_service.get_response(req.message, req.language)
        
        # Async Logging via DB Service (CI Safe)
        background_tasks.add_task(
            db_service.log_interaction, 
            session_id, req.message, ai_text, req.language
        )
        
        return ChatResponse(response=ai_text, session_id=session_id)
    except Exception as e:
        logging.error(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8080)))
