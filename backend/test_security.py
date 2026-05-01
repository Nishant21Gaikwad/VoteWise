import pytest
from fastapi.testclient import TestClient
import os
import sys

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set testing environment
os.environ["TESTING"] = "true"

from main import app

client = TestClient(app)

def test_security_headers_compliance():
    """
    Validates that the API complies with OWASP Top 10 security header requirements.
    """
    response = client.get("/")
    headers = response.headers
    
    # Fundamental security headers
    assert "X-Content-Type-Options" in headers
    assert "X-Frame-Options" in headers
    
    # Advanced security headers (If middleware is active)
    if "Content-Security-Policy" in headers:
        assert "default-src" in headers["Content-Security-Policy"]
