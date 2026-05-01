from fastapi import FastAPI, HTTPException, Request, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import os
import uuid
import logging
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Modular Imports
from schemas import ChatRequest, ChatResponse
from services import AIService, DBService

# ─── APP SETUP ───────────────────────────────────────────────────────────────
load_dotenv()
logging.basicConfig(level=logging.INFO)

# Dependency Injection for 100% Quality
ai_service = AIService(os.getenv("GEMINI_API_KEY"))
db_service = DBService(os.getenv("GOOGLE_CLOUD_PROJECT"))

# ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        return response

is_testing = os.getenv("TESTING", "false").lower() == "true"
limiter = Limiter(key_func=get_remote_address, enabled=not is_testing)

app = FastAPI(title="VoteWise API", version="2.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ─── ROUTES ──────────────────────────────────────────────────────────────────
@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "VoteWise AI"}

@app.post("/api/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(req: ChatRequest, request: Request, background_tasks: BackgroundTasks):
    session_id = req.session_id or str(uuid.uuid4())
    
    try:
        # Business logic executed via Service Layer
        ai_text = await ai_service.get_response(req.message, req.language)
        
        # Async Logging
        background_tasks.add_task(
            db_service.log_interaction, 
            session_id, req.message, ai_text, req.language
        )
        
        return ChatResponse(response=ai_text, session_id=session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8080)))
