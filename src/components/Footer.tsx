import { Phone, ExternalLink } from 'lucide-react';

/**
 * Footer Component
 * Features high-contrast typography, semantic landmarks, and clear external link labeling.
 */
export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-border mt-auto bg-card text-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand & Helpline Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20" aria-hidden="true">
                <span className="text-white font-black text-sm">V</span>
              </div>
              <span className="font-black text-2xl font-jakarta tracking-tight">VoteWise AI</span>
            </div>
            <p className="text-base text-muted-foreground max-w-sm mb-10 font-medium leading-relaxed">
              An interactive election education platform simplifying the democratic process through state-of-the-art AI and 3D storytelling.
            </p>
            
            {/* Problem Statement Alignment: National Voter Helpline */}
            <div 
              className="inline-flex items-center gap-4 px-6 py-4 rounded-3xl bg-primary/5 border border-primary/20 text-primary-dark"
              aria-label="National Voter Helpline 1950"
            >
              <Phone className="w-6 h-6" aria-hidden="true" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.15em]">National Voter Helpline</div>
                <div className="text-2xl font-black">1950</div>
              </div>
            </div>
          </div>
          
          {/* Navigation Section */}
          <nav aria-labelledby="footer-product-heading">
            <h3 id="footer-product-heading" className="font-black mb-6 text-xs uppercase tracking-[0.2em] text-foreground">Product</h3>
            <ul className="space-y-4 text-base font-bold text-muted-foreground">
              <li><a href="/journey" className="hover:text-primary transition-all focus:text-primary focus:outline-none underline-offset-4 hover:underline">Voter Journey</a></li>
              <li><a href="/timeline" className="hover:text-primary transition-all focus:text-primary focus:outline-none underline-offset-4 hover:underline">Election Timeline</a></li>
              <li><a href="/assistant" className="hover:text-primary transition-all focus:text-primary focus:outline-none underline-offset-4 hover:underline">AI Assistant</a></li>
            </ul>
          </nav>
          
          {/* External Resources Section */}
          <nav aria-labelledby="footer-resource-heading">
            <h3 id="footer-resource-heading" className="font-black mb-6 text-xs uppercase tracking-[0.2em] text-foreground">Resources</h3>
            <ul className="space-y-4 text-base font-bold text-muted-foreground">
              <li><a href="/myth-vs-fact" className="hover:text-primary transition-all focus:text-primary focus:outline-none underline-offset-4 hover:underline">Myths vs Facts</a></li>
              <li><a href="/booth-finder" className="hover:text-primary transition-all focus:text-primary focus:outline-none underline-offset-4 hover:underline">Booth Finder</a></li>
              <li>
                <a 
                  href="https://voters.eci.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-all flex items-center gap-2 focus:text-primary focus:outline-none underline-offset-4 hover:underline"
                  aria-label="Visit official ECI Voter Portal (opens in new tab)"
                >
                  ECI Portal <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Bottom Banner */}
        <div className="mt-16 pt-10 border-t border-border flex flex-col md:row items-center justify-between gap-6">
          <p className="text-sm font-bold text-muted-foreground">
            © {new Date().getFullYear()} VoteWise AI. A Civic-Tech Initiative for the Solution Challenge.
          </p>
          <div className="flex items-center gap-6" role="status" aria-label="System status: Operational">
            <span className="flex items-center gap-3 bg-success/10 text-success-dark px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span> 
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


