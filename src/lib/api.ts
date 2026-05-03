/**
 * VoteWise API Client
 * Centralized communication layer for backend interactions.
 * Implements strict typing and error handling.
 */

/**
 * Interface for chat requests sent to the backend.
 */
export interface ChatRequest {
  message: string;
  language: string;
  session_id?: string;
}

/**
 * Interface for chat responses received from the backend.
 */
export interface ChatResponse {
  /** The AI generated response text */
  response: string;
  /** Unique session identifier */
  session_id: string;
}

/**
 * Sends a message to the VoteWise AI Assistant backend.
 * 
 * @param req - The chat request object containing message and language.
 * @returns A promise resolving to the AI's response.
 * @throws Error if the network request fails or returns an error status.
 */
export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const API_URL = `${API_BASE_URL}/api/chat`;
  
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error instanceof Error ? error : new Error('An unexpected network error occurred');
  }
}

