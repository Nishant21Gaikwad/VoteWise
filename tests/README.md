# VoteWise AI Testing Framework

This project employs a **Triple-Layer Testing Strategy** to ensure 100% reliability and security.

## 🏗️ 1. Backend Unit & Integration Tests (`backend/test_main.py`)
- **Coverage**: Logic validation, schema enforcement, and error handling.
- **Mocks**: Uses `unittest.mock` to simulate Google Gemini API and Firestore without external dependencies.

## 🛡️ 2. Security Compliance Tests (`backend/test_security.py`)
- **Headers**: Verifies HSTS, CSP, and XSS protection.
- **Sanitization**: Ensures malicious scripts are stripped from user input before processing.

## 🌐 3. Frontend Logic Tests (`tests/frontend-smoke.test.js`)
- **Context**: Verifies language state management.
- **UI Logic**: Validates data formatting for Booth Finder and Assistant.

## 🚀 CI/CD Integration
All tests are executed automatically via **GitHub Actions** on every push, ensuring that the production environment remains stable and secure.
