'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Mic, Sparkles, Volume2, VolumeX, History, Info, SquareMenu, Trash2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

/**
 * AssistantPage - The core AI chat interface for VoteWise.
 * Features: Multilingual support, Text-to-Speech, and ECI-validated responses.
 */
export default function AssistantPage() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Smoothly scrolls the chat container to the latest message.
   */
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  /**
   * Text-to-Speech logic for accessibility and user engagement.
   */
  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (messages.length > 0) {
      const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMsg) speak(lastAssistantMsg.content);
    }
  }, [isSpeaking, messages, speak]);

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || isLoading) return;
    
    setInput('');
    await sendMessage(content);
  }, [input, isLoading, sendMessage]);

  const suggestions = useMemo(() => [
    "Am I eligible to vote?",
    "What documents do I need?",
    "Explain EVMs simply",
    "What is the Model Code of Conduct?"
  ], []);

  const recentTopics = useMemo(() => [
    "Voter ID Registration", 
    "Polling Booth Process", 
    "Candidate Nomination"
  ], []);

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto overflow-hidden bg-background">
      {/* Sidebar History - hidden on small screens */}
      <aside className="w-72 hidden lg:flex flex-col border-r border-border bg-card/40 backdrop-blur-xl" aria-label="Chat History">
        <div className="p-5 border-b border-border flex items-center justify-between text-sm font-bold tracking-tight">
          <div className="flex items-center gap-2 text-primary">
            <History className="w-4 h-4" /> Recent Topics
          </div>
          <button 
            onClick={clearChat}
            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {recentTopics.map((topic, i) => (
            <button 
              key={i} 
              className="w-full text-left p-3 text-sm text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all flex items-center gap-3 font-medium group"
              onClick={() => setInput(topic)}
            >
              <SquareMenu className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" /> {topic}
            </button>
          ))}
        </nav>
        
        <div className="p-5 border-t border-border bg-primary/5 m-4 rounded-2xl border border-primary/10 shadow-sm shadow-primary/5">
          <h4 className="text-[10px] font-black text-primary mb-2 uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5"/> Help Center
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Ask about Form 6, voter registration, or finding your polling station in multiple languages.
          </p>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col relative bg-card shadow-2xl shadow-primary/5 border-x border-border/50">
        {/* Chat Header */}
        <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-background/60 backdrop-blur-lg z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative shadow-inner overflow-hidden">
              <Bot className="w-6 h-6" />
              {isSpeaking && <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>}
            </div>
            <div>
              <h2 className="font-black font-jakarta text-lg leading-tight tracking-tight">VoteWise AI</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Active Assistant</span>
              </div>
            </div>
          </div>
          <button 
            onClick={toggleSpeech}
            aria-label={isSpeaking ? "Stop voice" : "Listen to response"}
            className={`p-3 rounded-xl transition-all duration-300 ${isSpeaking ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-muted-foreground hover:bg-muted hover:text-primary border border-transparent hover:border-border'}`}
          >
            {isSpeaking ? <Volume2 className="w-5 h-5 animate-bounce" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </header>

        {/* Message Thread */}
        <section 
          ref={messagesContainerRef} 
          className="flex-1 overflow-y-auto p-6 space-y-10 scroll-smooth bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
          aria-live="polite"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={`${msg.timestamp}-${i}`}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md border ${msg.role === 'user' ? 'bg-primary text-white border-primary/20' : 'bg-card text-primary border-border'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`relative px-6 py-4 rounded-[2rem] max-w-[85%] text-[15px] leading-relaxed font-medium shadow-sm transition-all hover:shadow-md ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card border border-border/80 rounded-tl-none text-foreground'}`}>
                  {msg.role === 'assistant' ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: msg.content }} 
                      className="space-y-3 prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mt-2" 
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
              role="status"
              aria-label="Assistant is thinking"
            >
              <div className="w-10 h-10 rounded-2xl bg-card border border-border text-primary flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="px-6 py-4 rounded-[2rem] bg-card border border-border rounded-tl-none flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-300"></span>
              </div>
            </motion.div>
          )}
        </section>

        {/* Interaction Footer */}
        <footer className="p-6 bg-gradient-to-t from-background via-background/90 to-transparent pt-16 mt-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Quick Suggestions */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar" aria-label="Suggested questions">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(s)}
                  className="whitespace-nowrap px-5 py-2.5 rounded-full bg-card border border-border/60 text-foreground text-sm font-bold hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent" /> {s}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition duration-700"></div>
              <div className="relative flex items-center gap-3 bg-card border border-border/80 rounded-[2.5rem] p-2.5 shadow-xl shadow-primary/5 backdrop-blur-md">
                <button 
                  aria-label="Start voice recognition"
                  className="p-3.5 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-300"
                >
                  <Mic className="w-5.5 h-5.5" />
                </button>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask VoteWise AI anything..."
                  className="flex-1 bg-transparent border-none outline-none px-2 text-foreground font-semibold placeholder:text-muted-foreground/60 text-lg"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  aria-label="Submit message"
                  className="p-4 bg-primary text-white rounded-full hover:bg-primary/90 transition-all disabled:opacity-40 shadow-xl shadow-primary/20 active:scale-95 flex items-center justify-center group/btn"
                >
                  <Send className={`w-5.5 h-5.5 ${!input.trim() ? '' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'}`} />
                </button>
              </div>
            </div>

            <p className="text-center text-[10px] text-muted-foreground/80 font-bold uppercase tracking-widest pt-2">
              Civic AI Assistant • Data sourced from ECI Portals
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

