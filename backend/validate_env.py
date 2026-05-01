import os
import sys
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Validator")

def validate():
    """
    Verifies that the execution environment has all required secrets.
    Prevents runtime crashes and improves system maintainability.
    """
    required = ["GEMINI_API_KEY"]
    missing = [var for var in required if not os.getenv(var)]
    
    if missing:
        logger.error(f"❌ CRITICAL ERROR: Missing required environment variables: {', '.join(missing)}")
        logger.error("Please set these in the Google Cloud Console or .env file.")
        sys.exit(1)
        
    logger.info("✅ Environment Validation Successful. All systems ready.")

if __name__ == "__main__":
    validate()
