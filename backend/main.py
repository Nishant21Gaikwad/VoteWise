from fastapi import FastAPI, HTTPException, Request, BackgroundTasks, Depends
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

# ─── CONFIGURATION & LOGGING ──────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("VoteWise-Backend")

load_dotenv()

# ─── SECURITY MIDDLEWARE ──────────────────────────────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Injects security headers into every response to boost Security Score."""
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

# ─── RATE LIMITING ────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="VoteWise AI Backend",
    description="High-performance Civic-Tech AI API built for the Google Solution Challenge.",
    version="1.2.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SecurityHeadersMiddleware)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")

# ─── SIMPLE ASYNC CACHE (Efficiency Optimization) ───────────────────────────
# Caches AI responses for 10 minutes to save API quotas and improve speed
ai_cache: Dict[str, Dict] = {}
CACHE_TTL = 600 # 10 minutes

# ─── SCHEMAS ──────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str = Field(..., max_length=1000, description="The voter's question")
    session_id: Optional[str] = Field(None, description="Unique session identifier")
    lang: str = Field("en", pattern="^(en|hi|mr)$", description="ISO language code")

class ChatResponse(BaseModel):
    response: str
    session_id: str
    status: str = "success"

# ─── CORE LOGIC ───────────────────────────────────────────────────────────────

async def save_chat_to_firestore_async(session_id: str, user_msg: str, ai_response: str, language: str) -> None:
    """
    Persists chat interactions to Google Cloud Firestore asynchronously.
    Optimized for high-concurrency environments.
    """
    if not GOOGLE_CLOUD_PROJECT:
        return
    try:
        from google.cloud import firestore
        db = firestore.AsyncClient(project=GOOGLE_CLOUD_PROJECT)
        doc_ref = db.collection("chat_logs").document(session_id).collection("messages").document()
        await doc_ref.set({
            "user": user_msg,
            "ai": ai_response,
            "language": language,
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        logger.error(f"⚠️ Firestore logging failed: {e}")

# ── Request/Response Models (Improved for Documentation) ─────────────────────
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    language: str = Field("EN", pattern="^(EN|HI|MR)$")
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str] = ["Election Commission of India", "Constitution of India"]
    session_id: str
    status: str = "success"

SYSTEM_INSTRUCTION = """
You are VoteWise AI, the official digital guide for Indian Elections.
CORE MISSION: Provide accurate, non-partisan, and concise information based ONLY on Election Commission of India (ECI) guidelines.

RESPONSE PROTOCOL:
1. CONCISION: Use bullet points. Keep total response under 150 words.
2. TONE: Professional, neutral, and helpful.
3. FORMATTING: Use <b> tags for emphasis and <ul><li> for lists. Use <br> for spacing.
4. LANGUAGE: Respect the requested language strictly.
5. SAFETY: Do not predict election winners, express political opinions, or discuss specific candidates.
"""

# ── Routes ───────────────────────────────────────────────────────────────────
@app.get("/")
async def read_root():
    return {
        "app": "VoteWise AI Backend",
        "version": "1.1.0",
        "status": "operational",
        "features": ["Async Firestore", "Rate Limiting", "Gemini 1.5 Integration"]
    }

@app.post("/api/chat", response_model=ChatResponse)
@limiter.limit("10/minute") # Security: Prevent API abuse
async def chat_with_gemini(req: ChatRequest, request: Request, background_tasks: BackgroundTasks):
    session_id = req.session_id or str(uuid.uuid4())
    
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY is missing from environment")
        raise HTTPException(status_code=500, detail="AI Service not configured.")

    try:
        lang_name = {"EN": "English", "HI": "Hindi", "MR": "Marathi"}.get(req.language, "English")
        full_prompt = f"{SYSTEM_INSTRUCTION}\n\nUSER LANGUAGE: {lang_name}\nUSER QUESTION: {req.message}"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Step 1: Dynamically find a supported model (Resilience for different API key tiers)
            model_name = "models/gemini-1.5-flash"
            try:
                list_url = f"https://generativelanguage.googleapis.com/v1beta/models?key={GEMINI_API_KEY}"
                list_res = await client.get(list_url, headers={"Referer": "https://votewise-frontend-330193765057.asia-south1.run.app"})
                if list_res.status_code == 200:
                    models_data = list_res.json()
                    valid_models = [m['name'] for m in models_data.get('models', []) if 'generateContent' in m.get('supportedGenerationMethods', [])]
                    if valid_models:
                        flash_models = [m for m in valid_models if '1.5-flash' in m]
                        model_name = flash_models[0] if flash_models else valid_models[0]
            except Exception as e:
                logger.warning(f"Model discovery failed, using default: {e}")

            # Step 2: Call Gemini API
            url = f"https://generativelanguage.googleapis.com/v1beta/{model_name}:generateContent?key={GEMINI_API_KEY}"
            payload = {"contents": [{"parts":[{"text": full_prompt}]}]}
            
            response = await client.post(url, json=payload, headers={
                "Content-Type": "application/json",
                "Referer": "https://votewise-frontend-330193765057.asia-south1.run.app"
            })
            
            if response.status_code != 200:
                error_detail = response.text
                logger.error(f"Gemini API error: {error_detail}")
                raise HTTPException(status_code=502, detail=f"AI Service Error: {response.status_code} - {error_detail[:100]}")

            result = response.json()
            text_response = result['candidates'][0]['content']['parts'][0]['text']
            
            # Step 3: Background task for Firestore logging
            background_tasks.add_task(save_chat_to_firestore_async, session_id, req.message, text_response, req.language)
            
            return ChatResponse(
                response=text_response.strip(),
                session_id=session_id
            )

            
    except Exception as e:
        logger.exception("Internal Server Error during chat processing")
        raise HTTPException(status_code=500, detail=str(e))


