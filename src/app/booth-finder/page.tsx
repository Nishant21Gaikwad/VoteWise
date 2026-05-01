'use client';

import { useState } from 'react';
import { Search, MapPin, Navigation, Users, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function BoothFinderPage() {
  const [zip, setZip] = useState('');
  const [searchedLocation, setSearchedLocation] = useState('New Delhi');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(false);
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zip.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setSearchedLocation(zip);
      setSearching(false);
      setResults(true);
    }, 1200);
  };

  const mockBooths = [
    { name: "Zilla Parishad Primary School", address: `Ward No. 4, ${searchedLocation}`, crowd: "Low (~10 mins)", crowdColor: "text-success", designated: true },
    { name: "Government High School", address: `Station Road, ${searchedLocation}`, crowd: "Moderate (~25 mins)", crowdColor: "text-accent", designated: false },
    { name: "Municipal Corporation Office", address: `MG Road, ${searchedLocation}`, crowd: "High (~45 mins)", crowdColor: "text-red-500", designated: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-10rem)]">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold font-jakarta mb-2">Booth Finder</h1>
          <p className="text-muted-foreground">Find your designated polling station and check live wait times.</p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            placeholder="Enter Pincode or City (e.g. 400001, Mumbai)"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <button 
            type="submit"
            disabled={searching}
            className="mt-4 w-full bg-primary text-white rounded-xl py-3 font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {searching ? 'Locating...' : 'Search Booths'}
          </button>
        </form>

        {!results && !searching && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 text-sm text-muted-foreground mt-4">
            <AlertCircle className="w-5 h-5 text-primary shrink-0" />
            <p>Enter your 6-digit Pincode or City name to locate the nearest Election Commission of India (ECI) approved polling booths.</p>
          </div>
        )}

        {results && (
          <div className="space-y-4 overflow-y-auto pr-2 pb-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Polling Stations near {searchedLocation}</h3>
            {mockBooths.map((booth, i) => (
              <div key={i} className={`p-5 rounded-xl border ${booth.designated ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-border bg-card'} cursor-pointer hover:border-primary/50 transition-all transform hover:-translate-y-1`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-md leading-tight pr-2">{booth.name}</h3>
                  {booth.designated && (
                    <span className="text-[10px] bg-success/20 text-success px-2 py-1 rounded-md font-bold uppercase tracking-wider shrink-0">Your Booth</span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm flex items-start gap-1 mb-4 leading-snug">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {booth.address}
                </p>
                <div className="flex items-center gap-4 text-sm font-medium border-t border-border/50 pt-3">
                  <div className={`flex items-center gap-1.5 ${booth.crowdColor}`}>
                    <Users className="w-4 h-4" /> {booth.crowd}
                  </div>
                  <button className="flex items-center gap-1 text-primary hover:underline ml-auto" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(booth.name + ' ' + booth.address)}`, '_blank')}>
                    <Navigation className="w-4 h-4" /> Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="w-full md:w-2/3 bg-muted rounded-2xl border border-border overflow-hidden relative min-h-[500px] shadow-inner">
        {searching ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm z-10">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-primary animate-pulse">Connecting to ECI Database...</p>
          </div>
        ) : null}
        
        <iframe 
          key={searchedLocation}
          width="100%" 
          height="100%" 
          style={{ border: 0, minHeight: '500px' }} 
          loading="lazy" 
          allowFullScreen 
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(searchedLocation + ', India')}&zoom=12`}
          className="transition-opacity duration-500"
        ></iframe>
      </div>
    </div>
  );
}
