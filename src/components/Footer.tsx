export function Footer() {
  return (
    <footer className="border-t border-border mt-auto bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs font-jakarta">V</span>
              </div>
              <span className="font-bold text-lg font-jakarta">VoteWise AI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              An interactive election education assistant simplifying the democratic process through AI and visual storytelling.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/journey" className="hover:text-primary transition-colors">Journey</a></li>
              <li><a href="/timeline" className="hover:text-primary transition-colors">Timeline</a></li>
              <li><a href="/assistant" className="hover:text-primary transition-colors">AI Assistant</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/myth-vs-fact" className="hover:text-primary transition-colors">Myths vs Facts</a></li>
              <li><a href="/booth-finder" className="hover:text-primary transition-colors">Booth Finder</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Accessibility Options</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} VoteWise AI. Built for the Hackathon.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
