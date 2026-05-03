'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Box, BookOpen, MapPin, CheckCircle2, Search, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PledgeSection } from '@/components/PledgeSection';

/**
 * Home Page Component
 * Features a high-contrast, semantic layout designed for maximum accessibility (A11y).
 */
export default function Home() {
  const [pincode, setPincode] = useState('');
  const { t } = useLanguage();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      window.location.href = `/booth-finder?q=${pincode}`;
    }
  }, [pincode]);

  const stats = useMemo(() => [
    { value: '968M+', labelKey: 'stats.voters', color: 'text-primary' },
    { value: '1M+', labelKey: 'stats.booths', color: 'text-accent' },
    { value: '543', labelKey: 'stats.constituencies', color: 'text-primary' },
    { value: '1.5Cr', labelKey: 'stats.officials', color: 'text-accent' },
  ], []);

  return (
    <main className="relative overflow-hidden selection:bg-primary/30">
      {/* Decorative Background - Hidden from Assistive Tech */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF9933]/10 via-background to-[#138808]/5" aria-hidden="true"></div>
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-24 max-w-7xl mx-auto px-6 lg:px-8" aria-labelledby="hero-heading">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-primary/20 text-primary-dark mb-8 font-black text-[10px] uppercase tracking-[0.2em]">
              <span className="flex h-2 w-2 rounded-full bg-[#138808] animate-ping" aria-hidden="true"></span>
              {t('hero.badge')}
            </div>
            
            <h1 id="hero-heading" className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight text-foreground mb-8 font-jakarta leading-[0.95]">
              {t('hero.title1')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e65c00] via-[#c44d00] to-[#0f6b06]">
                {t('hero.title2')}
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-xl leading-relaxed font-medium">
              {t('hero.desc')}
            </p>
            
            <nav className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5" aria-label="Hero Actions">
              <Link 
                href="/cinematic" 
                aria-label="Experience the Cinematic 3D EVM Guide"
                className="px-8 py-5 bg-primary text-white rounded-full font-black text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:-translate-y-1 active:scale-95 focus:ring-4 focus:ring-primary/20 outline-none"
              >
                <PlayCircle className="w-6 h-6" aria-hidden="true" /> {t('hero.btn.evm')}
              </Link>
              <Link 
                href="/assistant" 
                aria-label="Chat with the AI Election Assistant"
                className="px-8 py-5 bg-white text-foreground border-2 border-border rounded-full font-black text-lg hover:border-primary transition-all flex items-center justify-center gap-3 shadow-sm hover:-translate-y-1 active:scale-95 focus:ring-4 focus:ring-primary/10 outline-none"
              >
                <MessageSquare className="w-6 h-6 text-primary" aria-hidden="true" /> {t('hero.btn.ai')}
              </Link>
            </nav>
          </motion.div>

          {/* Right Interactive Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-accent/15 rounded-[3rem] blur-3xl -z-10" aria-hidden="true"></div>
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" aria-hidden="true"></div>
              
              <h2 className="text-3xl font-black mb-3 tracking-tight">{t('widget.title')}</h2>
              <p className="text-base text-muted-foreground mb-8 font-medium">{t('widget.subtitle')}</p>
              
              <div className="space-y-4">
                {[
                  { key: 'widget.age', desc: 'widget.age.desc' },
                  { key: 'widget.epic', desc: 'widget.epic.desc' }
                ].map((item) => (
                  <div key={item.key} className="flex items-start gap-4 p-5 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/20 transition-all cursor-default">
                    <CheckCircle2 className="text-success w-6 h-6 shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <div className="font-black text-base">{t(item.key as any)}</div>
                      <div className="text-sm text-muted-foreground font-medium">{t(item.desc as any)}</div>
                    </div>
                  </div>
                ))}
                
                <form onSubmit={handleSearch} className="mt-8 pt-8 border-t border-border">
                  <label htmlFor="pincode-search" className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-3 block">
                    {t('widget.search.label')}
                  </label>
                  <div className="flex gap-3">
                    <input 
                      id="pincode-search"
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder={t('widget.search.placeholder')} 
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 bg-muted/50 border-2 border-transparent rounded-2xl px-5 py-3.5 focus:bg-white focus:border-primary focus:outline-none transition-all font-mono text-lg font-bold"
                      aria-describedby="pincode-hint"
                    />
                    <button 
                      type="submit"
                      aria-label="Search for polling booth near this pincode"
                      className="bg-foreground text-white px-6 py-3.5 rounded-2xl hover:bg-primary transition-all flex items-center justify-center shadow-lg active:scale-95 focus:ring-4 focus:ring-primary/20"
                    >
                      <Search className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>
                  <span id="pincode-hint" className="text-[10px] text-muted-foreground mt-2 block font-medium uppercase tracking-tighter">Enter 6-digit Indian Pincode</span>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="bg-foreground text-white py-16 relative overflow-hidden" aria-label="Key Electoral Statistics">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat) => (
              <div key={stat.labelKey}>
                <div className={`text-5xl md:text-6xl font-black mb-3 tracking-tighter ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-white/50 font-black uppercase tracking-[0.25em]">{t(stat.labelKey as any)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BENTO BOX FEATURES */}
      <section className="py-32 max-w-7xl mx-auto px-6 lg:px-8" aria-labelledby="features-heading">
        <header className="text-center mb-20">
          <h2 id="features-heading" className="text-5xl md:text-7xl font-black mb-6 font-jakarta tracking-tight">
            The <span className="text-primary">VoteWise</span> Experience.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
            {t('bento.subtitle')}
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[340px]">
          
          {/* Bento 1: AI Assistant */}
          <Link 
            href="/assistant" 
            aria-label="Launch AI Election Assistant: Personalized guide for your voting queries"
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#fffbf5] to-white border border-primary/10 rounded-[3rem] p-12 relative overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-1 focus:ring-4 focus:ring-primary/20 outline-none"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" aria-hidden="true"></div>
            <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-8 shadow-sm">
              <MessageSquare className="w-10 h-10" aria-hidden="true" />
            </div>
            <h3 className="text-4xl font-black mb-6 tracking-tight">{t('bento.ai.title')}</h3>
            <p className="text-xl text-muted-foreground mb-10 max-w-md font-medium leading-relaxed">{t('bento.ai.desc')}</p>
            
            <div className="absolute bottom-12 right-12 flex flex-col gap-5 w-72 transform group-hover:scale-105 transition-transform" aria-hidden="true">
              <div className="bg-white p-4 rounded-2xl rounded-tr-sm shadow-xl text-sm font-bold border border-border/50 self-end">
                {t('bento.ai.chat1')}
              </div>
              <div className="bg-primary text-white p-4 rounded-2xl rounded-tl-sm shadow-xl text-sm font-black self-start">
                {t('bento.ai.chat2')}
              </div>
            </div>
          </Link>

          {/* Bento 2: Cinematic 3D */}
          <Link 
            href="/cinematic" 
            aria-label="Open 3D EVM Simulation: Visual guide to the voting process"
            className="bg-[#120f0e] text-white rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-1 focus:ring-4 focus:ring-primary/40 outline-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,153,51,0.25)_0%,transparent_80%)]" aria-hidden="true"></div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10">
              <Box className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">{t('bento.evm.title')}</h3>
            <p className="text-base text-white/50 font-medium leading-relaxed mb-6">{t('bento.evm.desc')}</p>
            <div className="absolute bottom-10 right-10">
              <PlayCircle className="w-14 h-14 text-primary group-hover:scale-110 transition-transform shadow-lg" aria-hidden="true" />
            </div>
          </Link>

          {/* Bento 3: Timeline & Journey */}
          <Link 
            href="/journey" 
            aria-label="View Voter Journey: Step-by-step roadmap for election day"
            className="bg-gradient-to-br from-[#f5fcf7] to-white border border-success/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-1 focus:ring-4 focus:ring-success/20 outline-none"
          >
             <div className="w-14 h-14 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-8">
              <MapPin className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">{t('bento.journey.title')}</h3>
            <p className="text-base text-muted-foreground font-medium leading-relaxed">{t('bento.journey.desc')}</p>
          </Link>

          {/* Bento 4: Resources */}
          <Link 
            href="/resources" 
            aria-label="Explore Resource Hub: Educational documents and guides"
            className="md:col-span-3 bg-white border-2 border-border rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between group hover:border-primary transition-all focus:ring-4 focus:ring-primary/10 outline-none"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent-dark mb-6 font-black text-[10px] uppercase tracking-widest border border-accent/20">
                {t('bento.resources.tag')}
              </div>
              <h3 className="text-4xl font-black mb-5 tracking-tight">{t('bento.resources.title')}</h3>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">{t('bento.resources.desc')}</p>
            </div>
            <div className="mt-12 md:mt-0 flex shrink-0 w-36 h-36 rounded-full bg-muted border-2 border-border items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-700 shadow-sm">
              <BookOpen className="w-14 h-14" aria-hidden="true" />
            </div>
          </Link>

        </div>
      </section>

      {/* 4. VOTER PLEDGE Section */}
      <PledgeSection />
    </main>
  );
}


