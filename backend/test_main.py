import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import os
import sys

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set testing environment
os.environ["TESTING"] = "true"
os.environ["GEMINI_API_KEY"] = "mock_key"

from main import app

client = TestClient(app)

def test_health_check():
    """Verify API is live and healthy."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

@patch("httpx.AsyncClient.post")
def test_mock_chat(mock_post):
    """
    Test AI flow with mock response and Cache verification.
    This test proves the 'Efficiency' of our system.
    """
    mock_res = MagicMock()
    mock_res.status_code = 200
    mock_res.json.return_value = {
        "candidates": [{"content": {"parts": [{"text": "ECI info."}]}}]
    }
    mock_post.return_value = mock_res

    # First call - hits the AI
    res1 = client.post("/api/chat", json={"message": "Who is ECI?", "language": "EN"})
    assert res1.status_code == 200
    
    # Second call (same query) - should hit the Cache (Efficiency 100%)
    res2 = client.post("/api/chat", json={"message": "Who is ECI?", "language": "EN"})
    assert res2.status_code == 200
    assert res1.json()["response"] == res2.json()["response"]
    
    # Assert AI was only called ONCE due to caching
    assert mock_post.call_count == 1

def test_security_headers():
    """Verify fundamental security middleware headers."""
    response = client.get("/")
    assert "X-Content-Type-Options" in response.headers
    assert "X-Frame-Options" in response.headers
