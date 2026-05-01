'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Map, Landmark, Users, Search, ChevronDown, FileText, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

const indianElections = [
  {
    id: 'lok-sabha',
    title: 'Lok Sabha (General Elections)',
    desc: 'Direct elections held every 5 years to elect Members of Parliament (MPs) to the lower house.',
    icon: Globe,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    details: [
      'The country is divided into 543 parliamentary constituencies.',
      'The party or coalition with a majority (272+ seats) forms the Central Government.',
      'The leader of the majority party becomes the Prime Minister of India.',
      'Elections are conducted using Electronic Voting Machines (EVMs) and VVPATs.'
    ]
  },
  {
    id: 'vidhan-sabha',
    title: 'Vidhan Sabha (State Assembly)',
    desc: 'Direct elections held every 5 years to elect Members of Legislative Assembly (MLAs) for states.',
    icon: Landmark,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    details: [
      'Determines the State Government and the Chief Minister.',
      'Each state is divided into specific territorial constituencies based on population.',
      'Functions parallel to the Lok Sabha but legislates on subjects in the State List (like police, healthcare).'
    ]
  },
  {
    id: 'rajya-sabha',
    title: 'Rajya Sabha (Upper House)',
    desc: 'Indirect elections for the Council of States. Members serve 6-year terms.',
    icon: Users,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    details: [
      'Members are elected by the elected members of State Legislative Assemblies (MLAs) using proportional representation.',
      'One-third of the members retire every two years, ensuring it is a permanent body that cannot be dissolved.',
      '12 members are nominated by the President for expertise in art, literature, science, and social services.'
    ]
  },
  {
    id: 'local-bodies',
    title: 'Panchayats & Municipalities',
    desc: 'Local self-government elections for rural (Panchayats) and urban (Municipalities) areas.',
    icon: Map,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    details: [
      'Conducted by the State Election Commission (not the ECI).',
      'Mandated by the 73rd and 74th Constitutional Amendments.',
      'Crucial for grassroots democracy, managing local infrastructure, sanitation, and primary education.',
      'One-third of all seats are reserved for women.'
    ]
  },
  {
    id: 'president',
    title: 'Presidential Elections',
    desc: 'Indirect election to appoint the Head of State of India.',
    icon: AwardIcon,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    details: [
      'Elected by an Electoral College consisting of elected members of both Houses of Parliament and Legislative Assemblies of States.',
      'Uses the system of proportional representation by means of the single transferable vote.',
      'The value of a vote differs between an MLA and an MP based on population formulas.'
    ]
  }
];

const importantConcepts = [
  {
    title: 'Election Commission of India (ECI)',
    content: 'An autonomous constitutional authority responsible for administering election processes in India. It ensures free and fair elections, registers political parties, and enforces the Model Code of Conduct.'
  },
  {
    title: 'EVM & VVPAT',
    content: 'EVM (Electronic Voting Machine) is used to cast votes electronically. VVPAT (Voter Verifiable Paper Audit Trail) is a slip generated immediately after voting, allowing voters to verify their vote was recorded correctly. It drops into a sealed box.'
  },
  {
    title: 'Model Code of Conduct (MCC)',
    content: 'A set of guidelines issued by the ECI for political parties and candidates during elections. It comes into effect immediately after the election schedule is announced and prevents the ruling party from using government machinery for campaigning.'
  },
  {
    title: 'NOTA (None of the Above)',
    content: 'A ballot option allowing voters to indicate their disapproval of all the candidates in a voting system. While it registers negative feedback, a majority NOTA vote does not invalidate the election results in India.'
  }
];

function AwardIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}

export default function ResourcesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold font-jakarta mb-4"
        >
          Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Election Guide</span>
        </motion.h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          Deep dive into the structure of Indian Democracy. Understand the hierarchy of elections, crucial concepts, and voting mechanisms.
        </p>
      </div>

      <div className="mb-16 relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input 
          type="text" 
          placeholder="Search for 'Lok Sabha', 'EVM', or 'NOTA'..."
          className="w-full bg-card border border-border rounded-full pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Column: Types of Elections */}
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-bold font-jakarta mb-6 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-primary" /> Types of Elections in India
          </h2>
          <div className="space-y-4">
            {indianElections.map((type) => {
              const isExpanded = expandedId === type.id;
              
              return (
                <div 
                  key={type.id}
                  className={`bg-card border transition-all duration-300 rounded-2xl overflow-hidden shadow-sm ${isExpanded ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'}`}
                >
                  <div 
                    className="p-6 cursor-pointer flex items-start gap-4"
                    onClick={() => setExpandedId(isExpanded ? null : type.id)}
                  >
                    <div className={`w-12 h-12 rounded-xl shrink-0 ${type.bg} ${type.color} flex items-center justify-center`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{type.title}</h3>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </motion.div>
                      </div>
                      <p className="text-muted-foreground mt-1 leading-relaxed pr-8">{type.desc}</p>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-2 ml-16">
                          <div className="bg-muted/50 rounded-xl p-5 border border-border">
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3">Key Structural Details</h4>
                            <ul className="space-y-3">
                              {type.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-secondary-foreground text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Key Concepts */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <h2 className="text-2xl font-bold font-jakarta mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" /> Crucial Concepts
            </h2>
            
            <div className="space-y-4">
              {importantConcepts.map((concept, i) => (
                <div key={i} className="bg-gradient-to-br from-card to-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-accent" /> {concept.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {concept.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-primary text-white rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <h3 className="font-bold text-xl mb-2 relative z-10">Ready to test your knowledge?</h3>
              <p className="text-primary-foreground/80 text-sm mb-4 relative z-10">Head over to the AI Assistant and ask questions about what you just read!</p>
              <a href="/assistant" className="inline-flex bg-white text-primary px-5 py-2.5 rounded-full font-bold text-sm shadow-sm hover:scale-105 transition-transform relative z-10">
                Go to AI Assistant
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
