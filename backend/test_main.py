import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

def test_health_check():
    """Verify that the API server is up and running."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_chat_validation():
    """Ensure that the API correctly validates inputs."""
    # Test missing message
    response = client.post("/api/chat", json={})
    assert response.status_code == 422
    
    # Test extremely long message (Security check)
    long_msg = "A" * 2001
    response = client.post("/api/chat", json={"message": long_msg})
    assert response.status_code == 422

def test_cors_headers():
    """Check for secure CORS configuration."""
    response = client.options("/api/chat", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
    })
    assert response.status_code == 200
    assert "Access-Control-Allow-Origin" in response.headers

@patch("httpx.AsyncClient.post")
def test_chat_ai_mock(mock_post):
    """
    Simulate an AI response to verify the end-to-end flow 
    without needing a real API Key (Perfect for CI/CD).
    """
    # Mock a successful Gemini API response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "candidates": [{"content": {"parts": [{"text": "Mocked AI Response"}]}}]
    }
    mock_post.return_value = mock_response

    response = client.post("/api/chat", json={"message": "Hello", "lang": "en"})
    assert response.status_code == 200
    assert "response" in response.json()
    assert response.json()["response"] == "Mocked AI Response"

def test_security_headers():
    """Ensure that the security middleware is injecting protection headers."""
    response = client.get("/health")
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"
