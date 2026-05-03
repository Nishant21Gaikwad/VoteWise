import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from '@/hooks/useChat';
import { LanguageProvider } from '@/context/LanguageContext';
import * as api from '@/lib/api';
import React from 'react';

// Mock the API module
vi.mock('@/lib/api', () => ({
  sendChatMessage: vi.fn()
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('useChat Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with a welcome message', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('assistant');
  });

  it('should send a message and handle AI response', async () => {
    const mockResponse = { response: 'Test AI Response', session_id: '123' };
    (api.sendChatMessage as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      await result.current.sendMessage('Hello AI');
    });

    expect(result.current.messages).toHaveLength(3); // Initial + User + Assistant
    expect(result.current.messages[1].content).toBe('Hello AI');
    expect(result.current.messages[2].content).toBe('Test AI Response');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle API errors gracefully', async () => {
    (api.sendChatMessage as any).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      await result.current.sendMessage('Hello AI');
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[2].content).toContain('Network Error');
  });

  it('should clear chat history', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    
    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toContain('cleared');
  });
});
