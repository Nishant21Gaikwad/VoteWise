from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "VoteWise API"
    VERSION: str = "2.2.0"
    PORT: int = 8080
    GEMINI_API_KEY: Optional[str] = None
    GOOGLE_CLOUD_PROJECT: Optional[str] = None
    FRONTEND_URL: str = "http://localhost:3000"
    TESTING: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings()
