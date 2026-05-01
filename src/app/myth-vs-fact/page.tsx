'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react';

const myths = [
  { 
    myth: "My single vote doesn't make a difference.", 
    fact: "Many elections are decided by narrow margins. Local elections especially can be swayed by just a few votes. Your vote is your voice."
  },
  {
    myth: "I can't vote if I don't have my physical voter ID card.",
    fact: "You can usually vote using alternative government-issued photo IDs (like passport, driver's license) if your name is on the electoral roll."
  },
  {
    myth: "Electronic Voting Machines can be easily hacked via Wi-Fi.",
    fact: "EVMs are standalone machines with no internet or wireless connectivity, making remote hacking impossible. They undergo rigorous checks."
  },
  {
    myth: "If I press NOTA (None of the Above), a re-election is triggered.",
    fact: "NOTA allows you to register your dissatisfaction, but it does not invalidate the election or force a re-election, even if it gets the most votes."
  }
];

export default function MythFactPage() {
  const [flipped, setFlipped] = useState<number[]>([]);

  const toggleFlip = (index: number) => {
    if (flipped.includes(index)) {
      setFlipped(flipped.filter(i => i !== index));
    } else {
      setFlipped([...flipped, index]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold font-jakarta mb-4">Myth vs Fact</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Misinformation can undermine democracy. Let's bust some common election myths with verified facts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 perspective-1000">
        {myths.map((item, i) => {
          const isFlipped = flipped.includes(i);
          return (
            <div 
              key={i} 
              className="relative h-64 w-full cursor-pointer group"
              onClick={() => toggleFlip(i)}
            >
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
              >
                {/* Front (Myth) */}
                <div className="absolute w-full h-full backface-hidden bg-destructive/10 border border-destructive/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="w-12 h-12 bg-destructive/20 text-destructive rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-destructive font-bold text-sm uppercase tracking-wider mb-2">Myth</h3>
                  <p className="text-xl font-medium text-foreground">{item.myth}</p>
                  <p className="absolute bottom-4 text-xs text-muted-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <RefreshCcw className="w-3 h-3" /> Click to reveal fact
                  </p>
                </div>

                {/* Back (Fact) */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-success/10 border border-success/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-success font-bold text-sm uppercase tracking-wider mb-2">Fact</h3>
                  <p className="text-lg text-foreground">{item.fact}</p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
      
      {/* Global CSS for 3D flip effect */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
}
