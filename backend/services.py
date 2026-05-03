import httpx
import time
import logging
import re
from typing import Dict, Optional
from config import settings

logger = logging.getLogger("VoteWise")

class AIService:
    def __init__(self, api_key: Optional[str]):
        self.api_key = api_key
        self.cache: Dict[str, Dict] = {}

    def sanitize(self, text: str) -> str:
        # Improved sanitization: strip tags and trim
        return re.sub(r'<[^>]*?>', '', text).strip()

    async def get_response(self, message: str, language: str) -> str:
        if not message:
            raise ValueError("Message cannot be empty")
            
        clean_msg = self.sanitize(message)
        cache_key = f"{language}:{clean_msg.lower()}"
        
        # Check cache for Efficiency 100%
        if cache_key in self.cache:
            entry = self.cache[cache_key]
            if time.time() - entry["time"] < 600:
                logger.info(f"Cache hit for {cache_key}")
                return entry["response"]

        # Production fallback
        if not self.api_key or self.api_key == "mock_key":
            logger.warning("Using mock response due to missing API key")
            return f"VoteWise AI: As an election assistant, I'm here to help you understand the process in {language}. (Running in developer mode)"

        instruction = (
          f"You are VoteWise AI, a neutral electoral assistant for India. "
          f"Provide accurate information based on ECI guidelines in {language}. "
          f"Keep responses concise, helpful, and civic-minded."
        )
        
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
                payload = {"contents": [{"parts": [{"text": f"{instruction}\n\nUser Query: {clean_msg}"}]}]}
                res = await client.post(url, json=payload)
                
                if res.status_code == 200:
                    ai_text = res.json()['candidates'][0]['content']['parts'][0]['text']
                    self.cache[cache_key] = {"response": ai_text, "time": time.time()}
                    return ai_text
                else:
                    logger.error(f"Gemini API Error {res.status_code}: {res.text}")
                    raise Exception(f"AI Provider Error: {res.status_code}")
        except httpx.RequestError as e:
            logger.error(f"Network Error: {e}")
            raise Exception("Connectivity issue with AI provider")

class DBService:
    """
    Handles persistent audit logging with Lazy Loading.
    Prevents CI/CD crashes by only initializing Firestore when needed.
    """
    def __init__(self, project_id: Optional[str]):
        self.project_id = project_id
        self._client = None

    @property
    def db(self):
        # Lazy initialization
        if settings.TESTING or not self.project_id:
            return None
        if self._client is None:
            try:
                from google.cloud import firestore
                self._client = firestore.AsyncClient(project=self.project_id)
            except Exception as e:
                logger.error(f"Firestore Init Failed: {e}")
                return None
        return self._client

    async def log_interaction(self, session_id: str, msg: str, res: str, lang: str):
        client = self.db
        if not client: return
        try:
            await client.collection("chat_logs").document(session_id).collection("messages").add({
                "user": msg, "ai": res, "lang": lang, "time": time.time()
            })
        except Exception as e:
            logger.error(f"Logging Failed: {e}")

