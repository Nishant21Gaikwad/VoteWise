'use client';

import { useState, useCallback } from 'react';
import { sendChatMessage } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Custom hook to manage chat logic, state, and API communication.
 * Separates business logic from the UI for better testability and maintenance.
 */
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Welcome to your personal Election Guide. I can help you understand eligibility, registration, and exactly what happens on polling day. Where would you like to start?',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { lang } = useLanguage();

  /**
   * Sends a user message and handles the AI response.
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await sendChatMessage({ message: content, language: lang });
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat processing failed:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: error instanceof Error ? error.message : "I'm having trouble connecting to the network. Please check your connection and try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  /**
   * Resets the chat history.
   */
  const clearChat = useCallback(() => {
    setMessages([{ 
      role: 'assistant', 
      content: 'Chat cleared. How can I assist you further?',
      timestamp: Date.now()
    }]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };
}
