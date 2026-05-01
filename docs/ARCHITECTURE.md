# VoteWise AI Architecture Overview

VoteWise AI is built on a high-performance, microservices-oriented architecture designed for the **Google Solution Challenge**.

## 🏗️ System Components

### 1. Frontend (Next.js 15)
- **Framework**: Next.js (App Router) for Server-Side Rendering and fast initial loads.
- **Styling**: Vanilla CSS with a design system based on modern UI/UX principles.
- **Accessibility**: ARIA-compliant components, keyboard navigation, and high-contrast support.

### 2. Backend (FastAPI / Python)
- **Logic**: FastAPI handles AI orchestration, session management, and security.
- **Efficiency**: Implements **Async I/O** (httpx) and **Response Caching** to reduce latency and API costs.
- **Security**: Strict rate limiting (SlowAPI) and secure HTTP headers.

### 3. Google Services Integration
- **Gemini 1.5 Flash**: Orchestrates multilingual voter education queries.
- **Google Cloud Firestore**: Asynchronous logging of chat interactions for transparency.
- **Google Cloud Run**: Containerized deployment for global scalability.
- **Google Maps API**: Real-time polling booth discovery.

## 🚀 Performance Optimizations
- **Non-blocking DB operations**: Using `BackgroundTasks` to log data without slowing down user responses.
- **AI Model Fallback**: Dynamic discovery between `gemini-1.5-flash` and `gemini-1.0-pro` for 99.9% uptime.
- **Caching Layer**: Frequent queries are served from memory to save resource costs.

## 🛡️ Security Measures
- **Rate Limiting**: 10 requests/minute per IP to prevent API abuse.
- **CORS Protection**: Secure cross-origin resource sharing.
- **Schema Validation**: Pydantic models enforce strict data types on all inputs.
