'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, Navigation, Archive, Fingerprint, Award, Power, Lock } from 'lucide-react';

const phases = [
  { id: 1, title: 'The Announcement', desc: 'ECI declares the dates. The Model Code of Conduct instantly freezes new government schemes.', icon: Navigation, color: 'text-amber-500' },
  { id: 2, title: 'Nomination', desc: 'Candidates file affidavits declaring assets and criminal records. Democracy demands transparency.', icon: Archive, color: 'text-blue-500' },
  { id: 3, title: 'Campaign Trail', desc: 'The great Indian festival of democracy. Rallies, roadshows, and manifestos flood the nation.', icon: Play, color: 'text-emerald-500' },
  { id: 4, title: 'The Polling Day', desc: '1 Billion voters. 1 Million polling booths. The silent revolution at the ballot box.', icon: Fingerprint, color: 'text-purple-500' },
];

export default function CinematicPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // 3D Scroll transforms for the hero text
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const [voted, setVoted] = useState(false);
  const [ledOn, setLedOn] = useState(false);
  const [vvpat, setVvpat] = useState(false);
  const [beeps, setBeeps] = useState(false);
  const [selectedCandIndex, setSelectedCandIndex] = useState<number | null>(null);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(2800, ctx.currentTime); // Sharp EVM frequency
      
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      setTimeout(() => osc.stop(), 2000); // 2 second loud beep
    } catch (e) {
      console.log('Audio not supported or blocked');
    }
  };

  const handleVote = (idx: number) => {
    if (voted) return;
    setVoted(true);
    setLedOn(true);
    setVvpat(true);
    setSelectedCandIndex(idx);
    
    // Play sound immediately to provide instant feedback
    setBeeps(true);
    playBeep();
    
    // Stop the visual beep indicator after the audio finishes (2s)
    setTimeout(() => {
      setBeeps(false);
    }, 2000);
    
    // Slip visible for exactly 7 seconds per ECI rules, then drops
    setTimeout(() => {
      setVvpat(false); // Triggers the drop animation
      setLedOn(false); // Turn off Red LED after slip drops
    }, 7000);
  };

  return (
    <div className="bg-[#050505] text-white min-h-[400vh] relative font-jakarta selection:bg-amber-500/30 overflow-x-hidden" ref={containerRef}>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.15)_0%,rgba(0,0,0,1)_60%)]"></div>
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      </div>

      {/* Intro Sequence (Sticky 3D Flying effect) */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden z-10 perspective-[2000px]">
        
        {/* The Title that zooms past you */}
        <motion.div 
          style={{ scale, opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-6 text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 drop-shadow-2xl"
          >
            The Great <br/>
            <span className="text-amber-500">Indian</span> Election
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="text-xl text-white/50 max-w-2xl mx-auto font-light tracking-widest uppercase"
          >
            Scroll to immerse
          </motion.p>
        </motion.div>

        {/* 3D Floating Phases passing by */}
        {phases.map((phase, i) => {
          const start = 0.15 + (i * 0.18);
          const peak = start + 0.09;
          const end = start + 0.18;
          
          // Cards move from deep Z to past the camera
          const cardZ = useTransform(scrollYProgress, [start, end], [-2000, 1500]);
          const cardOpacity = useTransform(scrollYProgress, [start, peak, end], [0, 1, 0]);
          
          return (
            <motion.div
              key={phase.id}
              style={{ 
                z: cardZ, 
                opacity: cardOpacity,
                position: 'absolute',
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
              }}
              className="w-[90%] max-w-3xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center gap-10"
            >
              <div className={`w-32 h-32 rounded-full bg-black/50 border border-white/5 shadow-inner flex items-center justify-center shrink-0 ${phase.color}`}>
                <phase.icon className="w-12 h-12 drop-shadow-lg" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] mb-3">Phase {phase.id}</h2>
                <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{phase.title}</h3>
                <p className="text-xl text-white/60 leading-relaxed font-light">{phase.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* The EVM Simulation (Bottom of the page) */}
      <div className="h-screen relative z-20 bg-black flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">Experience the Booth</h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            You've reached Polling Day. The realistic Indian EVM is ready. Press the blue button to cast your vote.
          </p>
        </motion.div>

        {/* 3D EVM Machine UI - Highly Realistic */}
        <div className="flex flex-col md:flex-row gap-8 items-end perspective-[1500px]">
          
          {/* Ballot Unit (BU) */}
          <motion.div 
            whileHover={{ rotateY: 2, rotateX: 2 }}
            className="w-80 bg-[#d8dce3] rounded-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_2px_10px_rgba(255,255,255,0.8)] border border-[#a3a9b5] relative"
          >
            {/* Screws */}
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-gray-400 shadow-inner"></div>
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gray-400 shadow-inner"></div>
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-gray-400 shadow-inner"></div>
            <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-gray-400 shadow-inner"></div>
            
            <div className="flex items-center justify-between mb-4 mt-2 px-2">
              <span className="text-[10px] font-black text-gray-600 tracking-widest flex items-center gap-1"><Power className="w-3 h-3 text-green-600"/> READY</span>
              <span className="text-[10px] font-black text-gray-500 tracking-widest border border-gray-400 px-2 py-0.5 rounded-full">BALLOT UNIT</span>
            </div>

            <div className="bg-[#b5bcc9] p-3 rounded-lg shadow-inner border border-[#9ca3af] space-y-2">
              {[
                { name: 'Candidate A', party: 'Party Alpha' },
                { name: 'Candidate B', party: 'Party Beta' },
                { name: 'NOTA', party: 'None of the Above' }
              ].map((cand, idx) => {
                const isSelected = voted && selectedCandIndex === idx;
                const isLedActive = ledOn && selectedCandIndex === idx;
                return (
                  <div key={idx} className="bg-white border-b-4 border-gray-300 p-2.5 rounded shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-lg font-bold text-gray-400 w-4">{idx + 1}</span>
                      <div>
                        <div className="font-bold text-gray-800 text-sm leading-tight">{cand.name}</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider">{cand.party}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Red Indicator LED */}
                      <div className={`w-4 h-4 rounded-full border-2 border-gray-400 shadow-inner transition-all duration-300 ${isLedActive ? 'bg-red-600 shadow-[0_0_15px_red,inset_0_0_5px_white]' : 'bg-[#4a1c1c] opacity-50'}`}></div>
                      
                      {/* The Big Blue Button */}
                      <button 
                        onClick={() => handleVote(idx)}
                        disabled={voted}
                        className={`w-12 h-9 rounded shadow-[inset_0_-4px_0_rgba(0,0,0,0.4),0_4px_5px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center
                          ${voted ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1e40af] hover:bg-[#1d4ed8] active:translate-y-1 active:shadow-[inset_0_-1px_0_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.3)]'}`}
                      >
                        <div className="w-8 h-5 bg-white/10 rounded-sm"></div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Braille indicator simulation */}
            <div className="mt-4 flex justify-end px-2">
              <div className="flex gap-1"><div className="w-1 h-1 bg-gray-400 rounded-full shadow-sm"></div><div className="w-1 h-1 bg-gray-400 rounded-full shadow-sm"></div></div>
            </div>
          </motion.div>

          {/* VVPAT Machine */}
          <motion.div 
            whileHover={{ rotateY: -2, rotateX: 2 }}
            className="w-72 h-96 bg-[#c4c9d4] rounded-t-[3rem] rounded-b-xl border border-[#8f96a3] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_5px_15px_rgba(255,255,255,0.9)] relative flex flex-col"
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <Lock className="w-4 h-4 text-gray-500 mb-1" />
              <div className="text-[10px] font-black text-gray-600 tracking-widest bg-gray-300 px-3 py-1 rounded-full border border-gray-400">VVPAT</div>
            </div>
            
            {/* The Glass Window */}
            <div className="mt-16 mx-6 h-48 bg-[#0a0a0a] rounded-lg border-[10px] border-[#1f2937] shadow-[inset_0_10px_30px_rgba(0,0,0,0.9)] relative overflow-hidden flex justify-center">
              {/* Glass reflection */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20"></div>
              
              {/* Internal Light (turns on when voting) */}
              <div className={`absolute inset-0 transition-opacity duration-300 z-0 ${vvpat ? 'bg-amber-100/20' : 'bg-transparent'}`}></div>

              {/* The Printed Slip */}
              <AnimatePresence>
                {vvpat && (
                  <motion.div 
                    initial={{ y: -200 }}
                    animate={{ y: 20 }}
                    exit={{ y: 250, opacity: 0 }}
                    transition={{ 
                      y: { duration: 1.5, ease: "easeOut" },
                      exit: { duration: 0.5, ease: "easeIn" } // drops fast into the box
                    }}
                    className="w-32 bg-[#f4f4f5] shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex flex-col items-center border border-gray-300 z-10"
                  >
                    <div className="w-full border-b border-gray-300 border-dashed py-2 text-center bg-gray-100">
                      <p className="text-black font-black text-[10px] uppercase">
                        {selectedCandIndex === 0 ? 'Candidate A' : selectedCandIndex === 1 ? 'Candidate B' : 'NOTA'}
                      </p>
                    </div>
                    <div className="py-4">
                      <Award className="w-10 h-10 text-black mx-auto" />
                    </div>
                    <div className="w-full border-t border-gray-300 border-dashed py-1 text-center bg-gray-100">
                      <p className="text-black text-[9px] font-mono font-bold">SL NO: 001</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* The Drop Box (Bottom part) */}
            <div className="mt-auto h-24 bg-[#a3a9b5] rounded-b-xl border-t-2 border-[#8f96a3] shadow-inner flex flex-col items-center justify-start pt-4 relative">
              <div className="w-48 h-2 bg-[#1a1a1a] rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"></div>
              <p className="text-[8px] uppercase font-bold text-gray-700 mt-2 tracking-widest">Sealed Ballot Box</p>
              
              {/* Seals */}
              <div className="absolute left-4 top-1/2 w-4 h-8 bg-red-600/80 rounded-sm shadow-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-900"></div>
              </div>
              <div className="absolute right-4 top-1/2 w-4 h-8 bg-red-600/80 rounded-sm shadow-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-900"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Audio Simulation Indicator */}
        {beeps && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 px-4 py-2 rounded-full text-green-400 font-mono text-sm border border-green-500/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span> 
            BEEEEEEEP...
          </div>
        )}
      </div>
    </div>
  );
}
