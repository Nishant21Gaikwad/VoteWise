import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_cors_headers():
    """Verify CORS restrictions are in place."""
    # Test with an unauthorized origin
    response = client.options(
        "/api/chat", 
        headers={"Origin": "https://malicious-site.com", "Access-Control-Request-Method": "POST"}
    )
    # FastAPI CORSMiddleware returns 200 for OPTIONS but without CORS headers if origin not allowed
    assert "access-control-allow-origin" not in response.headers

def test_strict_security_headers():
    """Verify advanced security headers for 100% Security Score."""
    response = client.get("/")
    assert response.headers["X-Frame-Options"] == "DENY"
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-XSS-Protection"] == "1; mode=block"
    assert "Strict-Transport-Security" in response.headers
    assert "Content-Security-Policy" in response.headers
    assert response.headers["Content-Security-Policy"] == "default-src 'self'"

def test_rate_limiting():
    """Verify rate limiting is functional (not enabled in testing by default, but we check config)."""
    from config import settings
    # Ensure limiter is tied to app state
    assert hasattr(app.state, "limiter")
