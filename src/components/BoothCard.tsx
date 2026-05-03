'use client';

import { MapPin, Users, Navigation } from 'lucide-react';
import React from 'react';

/**
 * Interface for Polling Booth data.
 */
export interface Booth {
  name: string;
  address: string;
  crowd: string;
  crowdColor: string;
  designated: boolean;
}

interface BoothCardProps {
  booth: Booth;
  onDirectionsClick: (booth: Booth) => void;
}

/**
 * A reusable component to display polling booth information.
 * Features accessibility-ready structure and interactive elements.
 */
export const BoothCard: React.FC<BoothCardProps> = React.memo(({ booth, onDirectionsClick }) => {
  return (
    <div 
      className={`p-5 rounded-xl border ${
        booth.designated 
          ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' 
          : 'border-border bg-card'
      } cursor-pointer hover:border-primary/50 transition-all transform hover:-translate-y-1`}
      role="article"
      aria-label={`Polling station: ${booth.name}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-md leading-tight pr-2">{booth.name}</h3>
        {booth.designated && (
          <span 
            className="text-[10px] bg-success/20 text-success px-2 py-1 rounded-md font-bold uppercase tracking-wider shrink-0"
            role="status"
          >
            Your Booth
          </span>
        )}
      </div>
      
      <p className="text-muted-foreground text-sm flex items-start gap-1 mb-4 leading-snug">
        <MapPin className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" /> {booth.address}
      </p>
      
      <div className="flex items-center gap-4 text-sm font-medium border-t border-border/50 pt-3">
        <div className={`flex items-center gap-1.5 ${booth.crowdColor}`} aria-label={`Wait time: ${booth.crowd}`}>
          <Users className="w-4 h-4" aria-hidden="true" /> {booth.crowd}
        </div>
        
        <button 
          className="flex items-center gap-1 text-primary hover:underline ml-auto font-bold"
          onClick={() => onDirectionsClick(booth)}
          aria-label={`Get directions to ${booth.name}`}
        >
          <Navigation className="w-4 h-4" aria-hidden="true" /> Directions
        </button>
      </div>
    </div>
  );
});

BoothCard.displayName = 'BoothCard';
