'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, FileText, UserCheck, Megaphone, MapPin, Award, BookOpen, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

const steps = [
  { id: 1, title: 'Eligibility Check', icon: UserCheck, desc: 'Are you eligible to be an Indian voter?', detail: 'You must be an Indian citizen, 18+ years of age as of Jan 1st of the revision year, and a resident of the polling area.' },
  { id: 2, title: 'Form 6 Registration', icon: FileText, desc: 'Get your name on the Electoral Roll.', detail: 'Apply online via the Voter Helpline App or NVSP portal using Form 6. You will need address and age proof to get your EPIC (Voter ID).' },
  { id: 3, title: 'Verify Details', icon: ShieldCheck, desc: 'Check the final published electoral roll.', detail: 'Search your name on the ECI portal. Having an EPIC card is not enough; your name MUST be on the final electoral roll to vote.' },
  { id: 4, title: 'Model Code of Conduct', icon: Megaphone, desc: 'The campaign period officially begins.', detail: 'Observe candidate rallies. Note that the MCC is enforced by the ECI to ensure a level playing field, banning bribes, liquor distribution, and hate speech.' },
  { id: 5, title: 'Polling Day via EVM', icon: MapPin, desc: 'Cast your vote at the designated booth.', detail: 'Carry your EPIC or recognized ID. Your finger will be marked with indelible ink. Press the blue button next to your chosen candidate on the EVM, and verify via the VVPAT slip.' },
  { id: 6, title: 'Results Declaration', icon: Award, desc: 'EVMs are opened and votes are tallied.', detail: 'Counting happens under heavy security and CCTV surveillance in the presence of party agents. The candidate with the highest votes in the constituency wins.' }
];

export default function JourneyPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleComplete = (id: number) => {
    if (!completedSteps.includes(id)) {
      setCompletedSteps([...completedSteps, id]);
    }
    
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    } else {
      // Trigger completion celebration
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const score = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-10 md:mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold font-jakarta mb-4"
        >
          Your Election <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Journey</span>
        </motion.h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">Master the democratic process step-by-step. Let's get you ready for polling day.</p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 md:mt-8 inline-flex flex-wrap justify-center items-center gap-4 bg-card px-6 md:px-8 py-4 rounded-full border border-border shadow-sm"
        >
          <div className="text-foreground font-bold">Civic Readiness: <span className="text-primary">{score}%</span></div>
          <div className="w-40 md:w-64 h-3 bg-muted rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          {score === 100 && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-success text-sm font-bold flex items-center gap-1 bg-success/10 px-3 py-1 rounded-full"
            >
              <PartyPopper className="w-4 h-4"/> Ready to Vote
            </motion.span>
          )}
        </motion.div>
      </div>

      <div className="grid md:grid-cols-12 gap-6 md:gap-12">
        {/* Progress Sidebar - horizontal scroll on mobile */}
        <div className="md:col-span-4">
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-4 md:gap-8 pb-4 md:pb-0 md:sticky md:top-24 md:space-y-8 relative md:before:absolute md:before:inset-0 md:before:ml-6 md:before:-translate-x-px md:before:h-full md:before:w-0.5 md:before:bg-gradient-to-b md:before:from-primary/50 md:before:via-border md:before:to-transparent">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              
              return (
                <motion.div 
                  key={step.id}
                  whileHover={{ x: 5 }}
                  className={`relative flex items-center gap-5 cursor-pointer transition-all duration-300 ${isActive || isCompleted ? 'opacity-100' : 'opacity-40 grayscale'}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 shadow-sm
                    ${isCompleted ? 'bg-success text-white border-success shadow-success/30' : 
                      isActive ? 'bg-primary text-white border-primary shadow-primary/30 scale-110' : 
                      'bg-card text-muted-foreground border-border'}`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4 md:w-5 md:h-5" />}
                  </div>
                  <div className="hidden md:block">
                    <h3 className={`text-lg font-bold ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</h3>
                    {isActive && <motion.div layoutId="activeIndicator" className="h-1 w-8 bg-primary rounded-full mt-1" />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="md:col-span-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {steps.map((step) => {
              if (activeStep !== step.id) return null;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="bg-card border border-border rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-xl shadow-primary/5 relative overflow-hidden group"
                >
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
                  
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary mb-6 md:mb-8 shadow-sm">
                    <step.icon className="w-8 md:w-10 h-8 md:h-10" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold mb-4 font-jakarta">{step.title}</h2>
                  <p className="text-lg md:text-2xl text-muted-foreground mb-6 md:mb-8 font-light leading-relaxed">{step.desc}</p>
                  
                  <div className="bg-background border border-border p-5 md:p-8 rounded-2xl mb-8 md:mb-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3 text-base md:text-lg"><BookOpen className="w-5 h-5 text-primary"/> Expert Details</h4>
                    <p className="text-secondary-foreground text-base md:text-lg leading-relaxed">{step.detail}</p>
                  </div>
                  
                  {score === 100 && step.id === steps.length ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-success/10 border border-success/30 p-6 rounded-2xl text-center"
                    >
                      <Award className="w-16 h-16 text-success mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-success mb-2">Journey Complete!</h3>
                      <p className="text-success/80 font-medium">You are fully equipped to participate in the democratic process.</p>
                      <button className="mt-4 px-6 py-2 bg-success text-white rounded-full font-bold shadow-lg shadow-success/30 hover:scale-105 transition-transform">Download Certificate</button>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => handleComplete(step.id)}
                      className={`px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all flex items-center gap-3 shadow-lg transform hover:-translate-y-1 ${
                        completedSteps.includes(step.id) 
                          ? 'bg-secondary text-foreground hover:bg-secondary/80 border border-border shadow-none' 
                          : 'bg-primary text-white hover:bg-primary/90 shadow-primary/30'
                      }`}
                    >
                      {completedSteps.includes(step.id) ? 'Proceed to Next Step' : 'I Understand This Step'} <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
