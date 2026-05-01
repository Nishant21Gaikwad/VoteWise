/**
 * VoteWise API Client
 * Centralized communication layer for backend interactions.
 * Implements strict typing and error handling.
 */

export interface ChatRequest {
  message: string;
  language: string;
  session_id?: string;
}

export interface ChatResponse {
  response: str;
  session_id: string;
  status: string;
}

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const API_URL = 'https://votewise-backend-330193765057.asia-south1.run.app/api/chat';
  
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Service Error');
  }

  return res.json();
}
