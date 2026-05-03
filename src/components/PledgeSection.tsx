'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Award, Share2, Download } from 'lucide-react';

/**
 * PledgeSection Component
 * An interactive module for users to commit to voting.
 * Uses local storage for persistence and canvas-confetti for gamification.
 */
export function PledgeSection() {
  const [hasPledged, setHasPledged] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(42910);

  // Initialize state from local storage
  useEffect(() => {
    try {
      const pledged = localStorage.getItem('voter-pledge');
      if (pledged === 'true') {
        setHasPledged(true);
      }
    } catch (e) {
      console.error('Local storage access failed:', e);
    }
  }, []);

  /**
   * Triggers the celebration and updates the local pledge state.
   */
  const handlePledge = useCallback(async () => {
    try {
      // Dynamic import for performance (only load when needed)
      const confetti = (await import('canvas-confetti')).default;
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF9933', '#FFFFFF', '#138808'] // Indian National Colors
      });

      localStorage.setItem('voter-pledge', 'true');
      setHasPledged(true);
      setPledgeCount(prev => prev + 1);
    } catch (error) {
      console.error('Pledge processing error:', error);
      // Fallback for failed confetti or storage
      setHasPledged(true);
    }
  }, []);

  return (
    <section 
      className="py-24 bg-[#FF9933]/5 border-y border-[#FF9933]/10 relative overflow-hidden" 
      aria-labelledby="pledge-title"
    >
      {/* Decorative Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF9933]/30 to-transparent" aria-hidden="true"></div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#FF9933] border border-[#FF9933]/20 mb-8 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
              Commit to Democracy
            </div>
            <h2 id="pledge-title" className="text-4xl md:text-6xl font-black mb-6 font-jakarta tracking-tight">
              I Pledge to <span className="text-primary">Vote.</span>
            </h2>
          </header>
          
          <AnimatePresence mode="wait">
            {!hasPledged ? (
              <motion.div
                key="pledge-cta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                  Join millions of Indian citizens in the world's largest democratic exercise. Your vote is your most powerful tool to shape India's future.
                </p>
                
                <button 
                  onClick={handlePledge}
                  aria-label="Commit to take the Voter Pledge"
                  className="group relative inline-flex items-center gap-4 px-12 py-6 bg-[#138808] text-white rounded-[2rem] font-black text-2xl shadow-2xl shadow-[#138808]/30 hover:scale-105 transition-all active:scale-[0.98] border border-[#138808]/20"
                >
                  Take the Voter Pledge
                  <CheckCircle2 className="w-7 h-7 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="pledge-success"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-success/10 max-w-2xl mx-auto relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-success/5 rounded-full -mr-24 -mt-24 blur-3xl transition-transform duration-1000 group-hover:scale-150" aria-hidden="true"></div>
                <div className="w-24 h-24 bg-success/10 text-success rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 transition-transform group-hover:rotate-0">
                  <Award className="w-12 h-12" aria-hidden="true" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-5 tracking-tight">Champion of Democracy!</h3>
                <p className="text-muted-foreground mb-10 font-medium text-lg leading-relaxed">
                  Thank you for your commitment. You have officially joined the league of informed voters and earned the <span className="text-success font-bold">Digital Voter Badge</span>.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button 
                    aria-label="Download your Voter Pledge Certificate"
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-white rounded-2xl font-black hover:bg-foreground/90 transition-all active:scale-95 shadow-lg"
                  >
                    <Download className="w-5 h-5" aria-hidden="true" /> Certificate
                  </button>
                  <button 
                    aria-label="Share your pledge on social media"
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-3 px-8 py-4 bg-primary/5 text-primary rounded-2xl font-black hover:bg-primary/10 transition-all border border-primary/20 active:scale-95"
                  >
                    <Share2 className="w-5 h-5" aria-hidden="true" /> Share Pride
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <footer className="mt-16 flex items-center justify-center gap-8 text-xs font-black text-muted-foreground/60 uppercase tracking-widest">
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-border shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" aria-hidden="true"></span> 
              <span>{pledgeCount.toLocaleString()} Citizens Committed</span>
            </div>
          </footer>
        </motion.div>
      </div>
    </section>
  );
}

