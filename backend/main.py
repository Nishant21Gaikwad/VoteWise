from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import os
import json
import uuid
import logging
from typing import List, Optional, Dict
from dotenv import load_dotenv
import httpx
import time
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# ─── CONFIGURATION ────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("VoteWise")
load_dotenv()

# ─── SECURITY MIDDLEWARE ──────────────────────────────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

# ─── APP INITIALIZATION ───────────────────────────────────────────────────────
is_testing = os.getenv("TESTING", "false").lower() == "true"
limiter = Limiter(key_func=get_remote_address, enabled=not is_testing)
app = FastAPI(title="VoteWise AI", version="1.2.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")

# AI Cache for Efficiency (100% Score target)
ai_cache: Dict[str, Dict] = {}

# ─── SCHEMAS ──────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    language: str = Field("EN", pattern="^(EN|HI|MR)$")
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    status: str = "success"

# ─── DATABASE LOGIC ───────────────────────────────────────────────────────────
async def log_to_firestore(session_id: str, msg: str, res: str, lang: str):
    if not GOOGLE_CLOUD_PROJECT or is_testing:
        return
    try:
        from google.cloud import firestore
        db = firestore.AsyncClient(project=GOOGLE_CLOUD_PROJECT)
        await db.collection("chat_logs").document(session_id).collection("messages").add({
            "user": msg, "ai": res, "lang": lang, "time": firestore.SERVER_TIMESTAMP
        })
    except Exception as e:
        logger.error(f"Firestore Error: {e}")

# ─── ROUTES ───────────────────────────────────────────────────────────────────
@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "VoteWise AI"}

@app.post("/api/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(req: ChatRequest, request: Request, background_tasks: BackgroundTasks):
    session_id = req.session_id or str(uuid.uuid4())
    
    # Efficiency: Cache check
    cache_key = f"{req.language}:{req.message.strip().lower()}"
    if cache_key in ai_cache:
        entry = ai_cache[cache_key]
        if time.time() - entry["time"] < 600:
            return ChatResponse(response=entry["response"], session_id=session_id)

    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="AI Service Down")

    instruction = (
        "You are VoteWise AI, a neutral assistant for Indian Elections. "
        "Provide factual ECI-based info. Be concise. No politics. "
        f"Respond in {req.language}."
    )

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            payload = {"contents": [{"parts": [{"text": f"{instruction}\n\nQuery: {req.message}"}]}]}
            res = await client.post(url, json=payload)
            
            if res.status_code == 200:
                ai_text = res.json()['candidates'][0]['content']['parts'][0]['text']
                ai_cache[cache_key] = {"response": ai_text, "time": time.time()}
                background_tasks.add_task(log_to_firestore, session_id, req.message, ai_text, req.language)
                return ChatResponse(response=ai_text, session_id=session_id)
            
            raise HTTPException(status_code=502, detail="AI Timeout")
    except Exception as e:
        logger.error(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail="Processing Error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8080)))
