'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Box, BookOpen, MapPin, CheckCircle2, Search, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const [pincode, setPincode] = useState('');
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden selection:bg-primary/30">
      {/* Festive Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF9933]/15 via-background to-[#138808]/5"></div>
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-primary/20 text-primary mb-6 font-bold text-xs tracking-wide uppercase">
            <span className="flex h-2 w-2 rounded-full bg-[#138808] animate-ping"></span>
            {t('hero.badge')}
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-foreground mb-6 font-jakarta leading-[1.1]">
            {t('hero.title1')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-[#e65c00] to-[#138808]">
              {t('hero.title2')}
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed font-medium">
            {t('hero.desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="/cinematic" className="px-6 py-4 bg-primary text-white rounded-full font-bold text-base sm:text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:-translate-y-1">
              <PlayCircle className="w-5 h-5" /> {t('hero.btn.evm')}
            </Link>
            <Link href="/assistant" className="px-6 py-4 bg-white text-foreground border border-border rounded-full font-bold text-base sm:text-lg hover:border-primary/50 transition-all flex items-center justify-center gap-2 shadow-sm hover:-translate-y-1">
              <MessageSquare className="w-5 h-5 text-primary" /> {t('hero.btn.ai')}
            </Link>
          </div>
          </motion.div>

          {/* Right Interactive Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10"></div>
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
              
              <h3 className="text-2xl font-bold mb-2">{t('widget.title')}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t('widget.subtitle')}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-default hover:border-primary/30 transition-colors">
                  <CheckCircle2 className="text-[#138808] w-6 h-6" />
                  <div>
                    <div className="font-bold text-sm">{t('widget.age')}</div>
                    <div className="text-xs text-muted-foreground">{t('widget.age.desc')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-default hover:border-primary/30 transition-colors">
                  <CheckCircle2 className="text-[#138808] w-6 h-6" />
                  <div>
                    <div className="font-bold text-sm">{t('widget.epic')}</div>
                    <div className="text-xs text-muted-foreground">{t('widget.epic.desc')}</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">{t('widget.search.label')}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={t('widget.search.placeholder')} 
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                    />
                    <button className="bg-foreground text-white px-4 py-2 rounded-lg hover:bg-foreground/80 transition-colors flex items-center justify-center">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="bg-foreground text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center divide-x divide-white/10">
            <div>
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">968M+</div>
              <div className="text-sm text-white/60 font-bold uppercase tracking-widest">{t('stats.voters')}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-accent mb-2">1M+</div>
              <div className="text-sm text-white/60 font-bold uppercase tracking-widest">{t('stats.booths')}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">543</div>
              <div className="text-sm text-white/60 font-bold uppercase tracking-widest">{t('stats.constituencies')}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-accent mb-2">1.5Cr</div>
              <div className="text-sm text-white/60 font-bold uppercase tracking-widest">{t('stats.officials')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO BOX FEATURES (Structured Interactive Layout) */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 font-jakarta">{t('bento.title')} <span className="text-primary">VoteWise.</span></h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('bento.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 auto-rows-auto md:auto-rows-[300px]">
          
          {/* Bento 1: AI Assistant (Large) */}
          <Link href="/assistant" className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#fff7ed] to-white border border-[#ffedd5] rounded-3xl p-10 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4">{t('bento.ai.title')}</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">{t('bento.ai.desc')}</p>
            
            {/* Mock Chat bubbles */}
            <div className="absolute bottom-10 right-10 flex flex-col gap-4 w-64 transform group-hover:scale-105 transition-transform">
              <div className="bg-white p-3 rounded-2xl rounded-tr-sm shadow-sm text-xs font-medium border border-gray-100 self-end">
                {t('bento.ai.chat1')}
              </div>
              <div className="bg-primary text-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-xs font-medium self-start">
                {t('bento.ai.chat2')}
              </div>
            </div>
            
          </Link>

          {/* Bento 2: Cinematic 3D */}
          <Link href="/cinematic" className="bg-[#1a1614] text-white rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl hover:shadow-black/20 transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,153,51,0.2)_0%,transparent_70%)]"></div>
            <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center mb-6 backdrop-blur-md">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t('bento.evm.title')}</h3>
            <p className="text-sm text-white/60 mb-6">{t('bento.evm.desc')}</p>
            <div className="absolute bottom-8 right-8">
              <PlayCircle className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          {/* Bento 3: Timeline & Journey */}
          <Link href="/journey" className="bg-gradient-to-br from-[#f0fdf4] to-white border border-[#dcfce7] rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
             <div className="w-12 h-12 rounded-xl bg-[#138808]/10 text-[#138808] flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t('bento.journey.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('bento.journey.desc')}</p>
          </Link>

          {/* Bento 4: Resources */}
          <Link href="/resources" className="md:col-span-3 bg-white border border-border rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between group hover:border-primary/50 transition-colors">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent mb-4 font-bold text-xs uppercase">
                {t('bento.resources.tag')}
              </div>
              <h3 className="text-3xl font-bold mb-4">{t('bento.resources.title')}</h3>
              <p className="text-lg text-muted-foreground">{t('bento.resources.desc')}</p>
            </div>
            <div className="mt-8 md:mt-0 flex shrink-0 w-32 h-32 rounded-full bg-gray-50 border border-gray-100 items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <BookOpen className="w-10 h-10" />
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
}
