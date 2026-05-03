'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { BoothCard, type Booth } from '@/components/BoothCard';

/**
 * Page component for locating polling booths and checking live wait times.
 * Implements performance optimizations and accessibility best practices.
 */
export default function BoothFinderPage() {
  const [zip, setZip] = useState('');
  const [searchedLocation, setSearchedLocation] = useState('New Delhi');
  const [isLocating, setIsLocating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { t } = useLanguage();
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  /**
   * Handles the search form submission with a simulated delay.
   */
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const query = zip.trim();
    if (!query) return;

    setIsLocating(true);
    setShowResults(false);

    // Simulated API Call
    searchTimeoutRef.current = setTimeout(() => {
      setSearchedLocation(query);
      setIsLocating(false);
      setShowResults(true);
    }, 1200);
  }, [zip]);

  /**
   * Memoized booth results to prevent unnecessary recalculations.
   */
  const pollingBooths = useMemo<Booth[]>(() => [
    { 
      name: "Zilla Parishad Primary School", 
      address: `Ward No. 4, ${searchedLocation}`, 
      crowd: "Low (~10 mins)", 
      crowdColor: "text-success", 
      designated: true 
    },
    { 
      name: "Government High School", 
      address: `Station Road, ${searchedLocation}`, 
      crowd: "Moderate (~25 mins)", 
      crowdColor: "text-accent", 
      designated: false 
    },
    { 
      name: "Municipal Corporation Office", 
      address: `MG Road, ${searchedLocation}`, 
      crowd: "High (~45 mins)", 
      crowdColor: "text-red-500", 
      designated: false 
    },
  ], [searchedLocation]);

  /**
   * Opens Google Maps for the selected booth.
   */
  const openDirections = useCallback((booth: Booth) => {
    const query = encodeURIComponent(`${booth.name} ${booth.address}, India`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-10rem)]">
      {/* Sidebar: Search & Results */}
      <aside className="w-full md:w-1/3 flex flex-col gap-6" aria-label="Search Controls">
        <header>
          <h1 className="text-3xl font-black font-jakarta mb-2 tracking-tight">Booth Finder</h1>
          <p className="text-muted-foreground font-medium">Find your designated polling station and check live wait times.</p>
        </header>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <label htmlFor="booth-search" className="sr-only">Enter Pincode or City</label>
            <input 
              id="booth-search"
              type="text" 
              placeholder="Enter Pincode or City (e.g. 400001, Mumbai)"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm font-medium"
              aria-label="Search Polling Booths"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" aria-hidden="true" />
          </div>

          <button 
            type="submit"
            disabled={isLocating}
            className="w-full bg-primary text-white rounded-xl py-4 font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isLocating ? 'Locating...' : 'Search Booths'}
          </button>
        </form>

        {/* Initial Empty State */}
        {!showResults && !isLocating && (
          <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl flex gap-4 text-sm text-muted-foreground mt-4 leading-relaxed">
            <AlertCircle className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
            <p>Enter your 6-digit Pincode or City name to locate the nearest Election Commission of India (ECI) approved polling booths.</p>
          </div>
        )}

        {/* Search Results List */}
        {showResults && (
          <section className="space-y-4 overflow-y-auto pr-2 pb-4" aria-live="polite">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-widest mb-4">
              Stations near {searchedLocation}
            </h3>
            {pollingBooths.map((booth, index) => (
              <BoothCard 
                key={`${booth.name}-${index}`}
                booth={booth} 
                onDirectionsClick={openDirections} 
              />
            ))}
          </section>
        )}
      </aside>

      {/* Map View Area */}
      <main className="w-full md:w-2/3 bg-muted rounded-3xl border border-border overflow-hidden relative min-h-[500px] shadow-inner">
        {isLocating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-md z-10">
            <div className="w-14 h-14 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-6"></div>
            <p className="font-black text-primary animate-pulse tracking-wide uppercase text-xs">Connecting to ECI Database...</p>
          </div>
        )}
        
        <iframe 
          title="Polling Booth Map Location"
          key={searchedLocation}
          width="100%" 
          height="100%" 
          style={{ border: 0, minHeight: '500px' }} 
          loading="lazy" 
          allowFullScreen 
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(searchedLocation + ', India')}&zoom=12`}
          className={`transition-opacity duration-700 ${isLocating ? 'opacity-0' : 'opacity-100'}`}
        ></iframe>
      </main>
    </div>
  );
}

