# VoteWise AI: Empowering the Largest Democracy with Intelligence

**Vertical**: Civic Tech / Election Education & Digital Democracy

## 🌟 Overview
VoteWise AI is a comprehensive, AI-powered platform designed to bridge the information gap for Indian voters. Developed for the hackathon, it leverages state-of-the-art Google Cloud technologies to provide a trustworthy, accessible, and cinematic guide to the election process.

## 🚀 How the Solution Works
1.  **AI Assistant**: A high-performance multilingual chatbot (Gemini 1.5 Flash) that answers complex voter queries using strict Election Commission of India (ECI) guidelines.
2.  **3D EVM Simulator**: A cinematic, interactive visualizer that demystifies the Electronic Voting Machine (EVM) and VVPAT process to build trust and reduce errors on polling day.
3.  **Real-time Utilities**: Includes a Google Maps-integrated Polling Booth Finder and an interactive Election Timeline.
4.  **Truth Engine**: A specialized "Myth vs. Fact" section to combat election-related misinformation.

## 🧠 Approach and Logic
*   **Dual-Core Architecture**:
    *   **Frontend**: Built with **Next.js 15** and **Framer Motion** for a premium, responsive UI. It features a custom `LanguageProvider` for instant localization between English, Hindi, and Marathi.
    *   **Backend**: A high-speed **FastAPI** (Python) server handles AI orchestration and data persistence.
*   **Intelligent Prompting**: The AI is governed by a strict "Official Guide" protocol, ensuring responses remain non-partisan, concise, and grounded in official constitutional data.
*   **Scalable Persistence**: Every AI interaction is logged asynchronously to **Google Cloud Firestore**, enabling auditability and system improvement without slowing down the user experience.
*   **Security First**: Implemented **Rate Limiting** (SlowAPI) and strict Pydantic schema validation to prevent API abuse and ensure data integrity.

## ☁️ Google Services Integration
*   **Google Gemini 1.5 Flash**: Orchestrates all intelligent query handling and multilingual translation.
*   **Google Cloud Firestore**: Provides a scalable NoSQL database for persistent session logging.
*   **Google Cloud Run**: Hosts the containerized microservices (Frontend & Backend) with automated scaling and high availability.
*   **Google Maps API**: Powers the interactive Polling Booth discovery feature.

## 📝 Assumptions & Considerations
1.  **Data Source**: Assumes ECI (Election Commission of India) as the primary source of truth for all guidelines.
2.  **User Access**: Designed for mobile-first access, assuming varying internet speeds (uses lightweight 3D assets and optimized build sizes).
3.  **Non-Partisanship**: The system is hardcoded to avoid political bias, candidate discussions, or election predictions.

## 🛠️ Technical Setup
```bash
# Frontend
npm install && npm run dev

# Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---
**Vote with Confidence. Vote with Wise AI.** 🇮🇳
