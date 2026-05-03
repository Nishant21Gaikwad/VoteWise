'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useCallback, useMemo, memo } from 'react';
import { useLanguage, type TranslationKey, type Language } from '@/context/LanguageContext';

/**
 * Premium Logo Component
 * Optimized SVG for performance and brand consistency.
 */
const Logo = memo(() => (
  <div className="relative w-9 h-9" aria-hidden="true">
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
      <circle cx="18" cy="18" r="17" fill="url(#grad)" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
        <line
          key={i}
          x1="18" y1="18"
          x2={18 + 11 * Math.cos((deg - 90) * Math.PI / 180)}
          y2={18 + 11 * Math.sin((deg - 90) * Math.PI / 180)}
          stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"
        />
      ))}
      <circle cx="18" cy="18" r="4" fill="white" opacity="0.95" />
      <path d="M15.5 18l2 2 3-3" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9933"/>
          <stop offset="1" stopColor="#138808"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
));
Logo.displayName = 'Logo';

interface NavItem {
  href: string;
  labelKey?: TranslationKey;
  label?: string;
  ariaLabel: string;
  icon?: string;
}

/**
 * Main Navigation Component
 * Features accessibility landmarks, multilingual support, and mobile responsiveness.
 */
export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const toggleLang = useCallback(() => setIsLangOpen(prev => !prev), []);

  const navItems = useMemo<NavItem[]>(() => [
    { href: '/journey', labelKey: 'nav.journey', ariaLabel: 'Follow the Voter Journey' },
    { href: '/timeline', labelKey: 'nav.timeline', ariaLabel: 'View Election Timeline' },
    { href: '/assistant', labelKey: 'nav.assistant', ariaLabel: 'Ask the AI Assistant' },
    { href: '/resources', labelKey: 'nav.resources', ariaLabel: 'Explore Election Resources' },
    { href: '/myth-vs-fact', labelKey: 'nav.myths', ariaLabel: 'See Election Myths vs Facts' },
    { href: '/booth-finder', label: '🗺️ Booths', ariaLabel: 'Locate your Polling Booth' },
  ], []);

  const languages: { code: Language; label: string; short: string }[] = useMemo(() => [
    { code: 'EN', label: 'English', short: 'EN' },
    { code: 'HI', label: 'हिंदी', short: 'हिं' },
    { code: 'MR', label: 'मराठी', short: 'मर' },
  ], []);

  const handleLangChange = useCallback((code: Language) => {
    setLang(code);
    setIsLangOpen(false);
    setIsMenuOpen(false);
  }, [setLang]);

  return (
    <nav role="navigation" aria-label="Main Navigation" className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" aria-hidden="true"></div>
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <Link href="/" aria-label="VoteWise AI Home" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Logo />
          <div className="flex flex-col leading-tight">
            <span className="font-black text-xl font-jakarta tracking-tight text-foreground">
              Vote<span className="text-primary">Wise</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">AI • Election Guide</span>
          </div>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-muted-foreground">
          <Link href="/cinematic" className="hover:text-amber-600 transition-colors flex items-center gap-1.5 text-amber-500">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true"></span>
            3D EVM
          </Link>
          
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              aria-label={item.ariaLabel}
              className={`hover:text-primary transition-all ${pathname === item.href ? 'text-primary' : ''}`}
            >
              {item.labelKey ? t(item.labelKey) : item.label}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-border mx-2"></div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black border border-red-100" aria-label="National Voter Helpline 1950">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" aria-hidden="true"></span>
            Helpline: 1950
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all px-3 py-2 rounded-xl hover:bg-muted"
              aria-label={`Current language: ${lang}. Click to change language`}
              aria-expanded={isLangOpen}
            >
              <Globe className="w-4 h-4" /> {lang} <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLangOpen && (
              <div 
                className="absolute right-0 top-12 bg-card border border-border shadow-2xl rounded-2xl py-2 w-32 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                role="listbox"
              >
                {languages.map((l) => (
                  <button 
                    key={l.code}
                    role="option" 
                    aria-selected={lang === l.code} 
                    onClick={() => handleLangChange(l.code)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-primary/5 hover:text-primary ${lang === l.code ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Link 
            href="/assistant" 
            className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            {t('hero.btn.ai')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={toggleMenu} 
          className="lg:hidden p-2.5 rounded-xl hover:bg-muted transition-colors text-foreground"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar/Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border px-4 py-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link href="/cinematic" onClick={toggleMenu} className="py-3 font-black text-amber-500 flex items-center gap-3 bg-amber-50 rounded-2xl px-4 border border-amber-100">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            3D EVM Simulation
          </Link>
          
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={toggleMenu}
                className={`py-3.5 px-4 rounded-2xl text-base font-bold transition-all ${pathname === item.href ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
              >
                {item.labelKey ? t(item.labelKey) : item.label}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 border-t border-border flex gap-3">
            {languages.map((l) => (
              <button 
                key={l.code}
                onClick={() => handleLangChange(l.code)}
                className={`flex-1 py-3.5 rounded-2xl text-sm font-black border-2 transition-all ${lang === l.code ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground'}`}
              >
                {l.short}
              </button>
            ))}
          </div>
          
          <Link 
            href="/assistant" 
            onClick={toggleMenu}
            className="bg-primary text-white text-center py-5 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-transform"
          >
            {t('hero.btn.ai')}
          </Link>
        </div>
      )}
    </nav>
  );
}

