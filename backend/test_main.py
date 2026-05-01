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
        "candidates": [{"content": {"parts": [{"text": "ECI is the Election Commission."}]}}]
    }
    mock_post.return_value = mock_res

    res = client.post("/api/chat", json={"message": "What is ECI?", "language": "EN"})
    assert res.status_code == 200
    assert "response" in res.json()
    assert "ECI" in res.json()["response"]

def test_security_headers():
    """Verify security middleware."""
    res = client.get("/")
    assert "X-Content-Type-Options" in res.headers
    assert res.headers["X-Frame-Options"] == "DENY"
