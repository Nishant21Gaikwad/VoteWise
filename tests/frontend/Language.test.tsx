import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import React from 'react';

// Wrapper for the provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('LanguageContext', () => {
  it('should provide default language as EN', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.lang).toBe('EN');
  });

  it('should change language and translate correctly', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    // Test EN
    expect(result.current.t('nav.journey')).toBe('Journey');

    // Change to HI
    act(() => {
      result.current.setLang('HI');
    });
    
    expect(result.current.lang).toBe('HI');
    expect(result.current.t('nav.journey')).toBe('यात्रा');
  });

  it('should return the key if translation is missing', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    // @ts-ignore - testing invalid key
    expect(result.current.t('non.existent.key')).toBe('non.existent.key');
  });
});
