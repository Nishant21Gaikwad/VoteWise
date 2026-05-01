from pydantic import BaseModel, Field
from typing import List, Optional

/**
 * VoteWise Data Schemas
 * Implements strict validation and documentation for the API layer.
 */

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="The user's query")
    language: str = Field("EN", pattern="^(EN|HI|MR)$", description="Target response language")
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str = Field(..., description="The AI-generated response")
    session_id: str = Field(..., description="Unique chat session identifier")
    status: str = "success"
    sources: List[str] = ["ECI Guidelines", "Constitution of India"]
