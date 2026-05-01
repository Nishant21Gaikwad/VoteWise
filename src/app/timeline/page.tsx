'use client';

import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';

const events = [
  { date: 'Phase 1', title: 'Press Conference by ECI', status: 'past', desc: 'The Election Commission of India announces the schedule and the Model Code of Conduct (MCC) immediately comes into effect.' },
  { date: 'Phase 2', title: 'Issue of Notification', status: 'past', desc: 'The official notification is issued by the President/Governor, formally initiating the election process for constituencies.' },
  { date: 'Phase 3', title: 'Filing of Nominations', status: 'active', desc: 'Candidates file their nomination papers along with an affidavit detailing their criminal, financial, and educational background.' },
  { date: 'Phase 4', title: 'Scrutiny & Withdrawal', status: 'upcoming', desc: 'Returning Officers scrutinize nominations. Valid candidates are given a few days to withdraw if they choose.' },
  { date: 'Phase 5', title: 'Phased Polling', status: 'upcoming', desc: 'Voters cast ballots using EVMs. Due to security and logistics, Indian general elections are usually held in 5-7 phases.' },
  { date: 'Phase 6', title: 'Counting of Votes', status: 'upcoming', desc: 'EVMs from all phases are opened simultaneously on a designated day and the results are declared.' },
];

export default function TimelinePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold font-jakarta mb-4">Election Timeline</h1>
        <p className="text-muted-foreground text-lg">Stay updated with important dates and phases.</p>
        <button className="mt-6 px-6 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors inline-flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" /> Sync to Calendar
        </button>
      </div>

      <div className="relative border-l-2 border-primary/20 ml-4 md:ml-1/2">
        {events.map((event, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12 ml-8 relative"
          >
            <div className={`absolute -left-[41px] w-5 h-5 rounded-full border-4 border-background 
              ${event.status === 'past' ? 'bg-muted-foreground' : event.status === 'active' ? 'bg-primary animate-pulse' : 'bg-background border-primary'}`} 
            />
            
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              {event.status === 'active' && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                  Current Phase
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-2">
                {event.status === 'past' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                {event.date}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
              <p className="text-muted-foreground">{event.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
