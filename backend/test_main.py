import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock

# Force TESTING mode
import os
os.environ["TESTING"] = "true"

client = TestClient(app)

def test_health():
    """Verify system is operational."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_validation():
    """Check input constraints."""
    # Empty message
    res = client.post("/api/chat", json={"message": "", "language": "EN"})
    assert res.status_code == 422
    
    # Invalid language
    res = client.post("/api/chat", json={"message": "Test", "language": "FR"})
    assert res.status_code == 422

@patch("httpx.AsyncClient.post")
def test_mock_chat(mock_post):
    """Test AI flow with mock response."""
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
    """Verify security middleware."""
    res = client.get("/")
    assert "X-Content-Type-Options" in res.headers
    assert res.headers["X-Frame-Options"] == "DENY"
