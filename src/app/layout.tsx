import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: 'VoteWise AI | Understand Elections, Vote with Confidence',
  description: 'Interactive AI guidance for understanding election timelines, registration, voting process, rights, and civic participation.',
  keywords: ['election', 'voting', 'AI assistant', 'civic tech', 'voter guide'],
  authors: [{ name: 'VoteWise AI' }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
  openGraph: {
    title: 'VoteWise AI',
    description: 'Understand Elections. Vote with Confidence.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased min-h-screen flex flex-col selection:bg-primary selection:text-white`}>
        {/* Skip to content link for Accessibility 100% */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <LanguageProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>

          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
