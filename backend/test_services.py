import pytest
import asyncio
from unittest.mock import AsyncMock, patch
from services import AIService, DBService
from config import settings

@pytest.fixture
def ai_service():
    return AIService(api_key="test_key")

@pytest.fixture
def db_service():
    return DBService(project_id="test_project")

@pytest.mark.asyncio
async def test_ai_service_cache(ai_service):
    # First call
    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.return_value = AsyncMock(status_code=200)
        mock_post.return_value.json.return_value = {
            "candidates": [{"content": {"parts": [{"text": "First Response"}]}}]
        }
        
        res1 = await ai_service.get_response("Hello", "EN")
        assert res1 == "First Response"
        assert mock_post.call_count == 1
        
        # Second call should be cached
        res2 = await ai_service.get_response("Hello", "EN")
        assert res2 == "First Response"
        assert mock_post.call_count == 1  # Still 1 because of cache

@pytest.mark.asyncio
async def test_ai_service_sanitization(ai_service):
    text_with_tags = "<p>Hello <b>World</b></p>"
    clean = ai_service.sanitize(text_with_tags)
    assert clean == "Hello World"

@pytest.mark.asyncio
async def test_ai_service_error_handling(ai_service):
    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.return_value = AsyncMock(status_code=500, text="Internal Error")
        
        with pytest.raises(Exception) as excinfo:
            await ai_service.get_response("Fail me", "EN")
        assert "AI Provider Error" in str(excinfo.value)

@pytest.mark.asyncio
async def test_db_service_lazy_loading(db_service):
    # DB client should be None initially
    assert db_service._client is None
    
    # Accessing .db property in testing mode should return None
    with patch("config.settings.TESTING", True):
        assert db_service.db is None
        
    # Test property without testing mode (mocking firestore)
    with patch("config.settings.TESTING", False):
        with patch("google.cloud.firestore.AsyncClient") as mock_firestore:
            client = db_service.db
            assert client is not None
            assert db_service._client is not None
            mock_firestore.assert_called_once()
