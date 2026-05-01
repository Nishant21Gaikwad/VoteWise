import os
import httpx
import time
import logging
import re
from typing import Dict, Optional

logger = logging.getLogger("VoteWise")

class AIService:
    def __init__(self, api_key: Optional[str]):
        self.api_key = api_key
        self.cache: Dict[str, Dict] = {}

    def sanitize(self, text: str) -> str:
        return re.sub(r'<[^>]*?>', '', text)

    async def get_response(self, message: str, language: str) -> str:
        clean_msg = self.sanitize(message)
        cache_key = f"{language}:{clean_msg.strip().lower()}"
        
        if cache_key in self.cache:
            entry = self.cache[cache_key]
            if time.time() - entry["time"] < 600:
                return entry["response"]

        if not self.api_key or self.api_key == "mock_key":
            return f"Mock response in {language} for: {clean_msg}"

        instruction = f"You are VoteWise AI. Provide neutral ECI info in {language}."
        
        async with httpx.AsyncClient(timeout=20.0) as client:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
            payload = {"contents": [{"parts": [{"text": f"{instruction}\n\nQuery: {clean_msg}"}]}]}
            res = await client.post(url, json=payload)
            
            if res.status_code == 200:
                ai_text = res.json()['candidates'][0]['content']['parts'][0]['text']
                self.cache[cache_key] = {"response": ai_text, "time": time.time()}
                return ai_text
            
            raise Exception("AI Provider Error")

class DBService:
    """
    Handles persistent audit logging with Lazy Loading.
    Prevents CI/CD crashes by only initializing Firestore when needed.
    """
    def __init__(self, project_id: Optional[str]):
        self.project_id = project_id
        self._client = None
        self.is_testing = os.getenv("TESTING", "false").lower() == "true"

    @property
    def db(self):
        # Lazy initialization: Only create client if we have a project and NOT testing
        if self.is_testing or not self.project_id:
            return None
        if self._client is None:
            try:
                from google.cloud import firestore
                self._client = firestore.AsyncClient(project=self.project_id)
            except Exception as e:
                logger.error(f"DB Init Failed: {e}")
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
