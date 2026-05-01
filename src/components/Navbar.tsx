'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md shadow-sm">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Premium Logo Icon — Ashoka Wheel + Ballot motif */}
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
              <circle cx="18" cy="18" r="17" fill="url(#grad)" />
              {/* Spokes — inspired by Ashoka Chakra */}
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
                <line
                  key={i}
                  x1="18" y1="18"
                  x2={18 + 11 * Math.cos((deg - 90) * Math.PI / 180)}
                  y2={18 + 11 * Math.sin((deg - 90) * Math.PI / 180)}
                  stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"
                />
              ))}
              <circle cx="18" cy="18" r="4" fill="white" opacity="0.95" />
              {/* Checkmark inside center */}
              <path d="M15.5 18l2 2 3-3" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF9933"/>
                  <stop offset="1" stopColor="#138808"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span className="font-black text-lg font-jakarta tracking-tight text-foreground">Vote<span className="text-primary">Wise</span></span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">AI • Election Guide</span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-muted-foreground">
          <Link href="/cinematic" className="hover:text-amber-500 font-bold transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            3D EVM
          </Link>
          <Link href="/journey" className="hover:text-primary transition-colors">{t('nav.journey')}</Link>
          <Link href="/timeline" className="hover:text-primary transition-colors">{t('nav.timeline')}</Link>
          <Link href="/assistant" className="hover:text-primary transition-colors">{t('nav.assistant')}</Link>
          <Link href="/resources" className="hover:text-primary transition-colors">{t('nav.resources')}</Link>
          <Link href="/myth-vs-fact" className="hover:text-primary transition-colors">{t('nav.myths')}</Link>
          <Link href="/booth-finder" className={`hover:text-primary transition-colors ${pathname === '/booth-finder' ? 'text-primary font-semibold' : ''}`}>🗺️ Booths</Link>
        </div>
        
        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Change Language"
              aria-expanded={dropdownOpen}
            >
              <Globe className="w-4 h-4" /> {lang} <ChevronDown className="w-3 h-3" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-8 bg-white border border-border shadow-lg rounded-lg py-2 w-24 z-50">
                <button onClick={() => { setLang('EN'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">English</button>
                <button onClick={() => { setLang('HI'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">हिंदी</button>
                <button onClick={() => { setLang('MR'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">मराठी</button>
              </div>
            )}
          </div>
          <Link href="/assistant" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
            {t('hero.btn.ai')}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-4 flex flex-col gap-3">
          <Link href="/cinematic" onClick={() => setIsOpen(false)} className="py-2 font-bold text-amber-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span>3D EVM</Link>
          <Link href="/journey" onClick={() => setIsOpen(false)} className="py-2 text-foreground hover:text-primary">{t('nav.journey')}</Link>
          <Link href="/timeline" onClick={() => setIsOpen(false)} className="py-2 text-foreground hover:text-primary">{t('nav.timeline')}</Link>
          <Link href="/assistant" onClick={() => setIsOpen(false)} className="py-2 text-foreground hover:text-primary">{t('nav.assistant')}</Link>
          <Link href="/resources" onClick={() => setIsOpen(false)} className="py-2 text-foreground hover:text-primary">{t('nav.resources')}</Link>
          <Link href="/myth-vs-fact" onClick={() => setIsOpen(false)} className="py-2 text-foreground hover:text-primary">{t('nav.myths')}</Link>
          <Link href="/booth-finder" onClick={() => setIsOpen(false)} className="py-2 text-foreground hover:text-primary">🗺️ Booth Finder</Link>
          <div className="pt-3 border-t border-border flex gap-3">
            <button onClick={() => { setLang('EN'); setIsOpen(false); }} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${lang==='EN'?'border-primary text-primary bg-primary/5':'border-border'}`}>EN</button>
            <button onClick={() => { setLang('HI'); setIsOpen(false); }} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${lang==='HI'?'border-primary text-primary bg-primary/5':'border-border'}`}>हिं</button>
            <button onClick={() => { setLang('MR'); setIsOpen(false); }} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${lang==='MR'?'border-primary text-primary bg-primary/5':'border-border'}`}>मर</button>
          </div>
          <Link href="/assistant" onClick={() => setIsOpen(false)} className="mt-2 bg-primary text-white text-center py-3 rounded-full font-semibold">{t('hero.btn.ai')}</Link>
        </div>
      )}
    </nav>
  );
}
