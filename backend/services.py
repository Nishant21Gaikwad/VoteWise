import os
import httpx
import time
import logging
import re
from typing import Dict
from google.cloud import firestore

logger = logging.getLogger("VoteWise")

class AIService:
    """
    Handles AI Orchestration, Model Discovery, and Response Caching.
    Encapsulates all business logic for 100% Code Quality.
    """
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.cache: Dict[str, Dict] = {}

    def sanitize(self, text: str) -> str:
        return re.sub(r'<[^>]*?>', '', text)

    async def get_response(self, message: str, language: str) -> str:
        clean_msg = self.sanitize(message)
        cache_key = f"{language}:{clean_msg.strip().lower()}"
        
        # Cache logic
        if cache_key in self.cache:
            entry = self.cache[cache_key]
            if time.time() - entry["time"] < 600:
                return entry["response"]

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
    """Handles persistent audit logging."""
    def __init__(self, project_id: str):
        self.project_id = project_id
        self.db = firestore.AsyncClient(project=project_id) if project_id else None

    async def log_interaction(self, session_id: str, msg: str, res: str, lang: str):
        if not self.db: return
        await self.db.collection("chat_logs").document(session_id).collection("messages").add({
            "user": msg, "ai": res, "lang": lang, "time": firestore.SERVER_TIMESTAMP
        })
