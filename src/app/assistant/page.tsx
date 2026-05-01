'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Mic, Sparkles, Volume2, VolumeX, History, Info, SquareMenu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to your personal Election Guide. I can help you understand eligibility, registration, and exactly what happens on polling day. Where would you like to start?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const { lang } = useLanguage();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('https://votewise-backend-330193765057.asia-south1.run.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, language: lang })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to get response');
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: error.message || "I'm having trouble connecting to my knowledge base right now. Please ensure the API Key is valid." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Am I eligible to vote?",
    "What documents do I need?",
    "Explain EVMs simply",
    "What is the Model Code of Conduct?"
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto overflow-hidden bg-background">
      {/* Sidebar History - hidden on mobile */}
      <div className="w-64 hidden xl:flex flex-col border-r border-border bg-card/30 backdrop-blur-md">
        <div className="p-4 border-b border-border flex items-center gap-2 text-sm font-semibold">
          <History className="w-4 h-4" /> Recent Topics
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {["Voter ID Registration", "Polling Booth Process", "Candidate Nomination"].map((topic, i) => (
            <div key={i} className="p-3 text-sm text-muted-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors flex items-center gap-2">
              <SquareMenu className="w-4 h-4" /> {topic}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border bg-primary/5 m-4 rounded-xl">
          <h4 className="text-xs font-bold text-primary mb-1 uppercase tracking-wider flex items-center gap-1"><Info className="w-3 h-3"/> Tip</h4>
          <p className="text-xs text-muted-foreground">Ask me to translate concepts into Spanish or Hindi!</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-card shadow-xl shadow-primary/5">
        {/* Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
              <Bot className="w-6 h-6" />
              {isSpeaking && <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-ping"></span>}
            </div>
            <div>
              <h1 className="font-bold font-jakarta text-lg leading-tight">Election Guide AI</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span> Online & Ready
              </p>
            </div>
          </div>
          <button 
            onClick={toggleSpeech}
            className={`p-2 rounded-full transition-colors ${isSpeaking ? 'bg-primary text-white shadow-md shadow-primary/30 animate-pulse' : 'text-muted-foreground hover:bg-muted'}`}
            title="Toggle Voice"
          >
            {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'user' ? 'bg-primary text-white border-primary/20' : 'bg-card text-primary border-border'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`relative px-5 py-4 rounded-2xl max-w-[85%] text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted/50 border border-border rounded-tl-none text-foreground'}`}>
                  {msg.role === 'assistant' ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} className="space-y-2 [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mt-1" />
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
              aria-busy="true"
            >
              <div className="w-10 h-10 rounded-full bg-card border border-border text-primary flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-muted/50 border border-border rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-200"></span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(s)}
                  className="whitespace-nowrap px-4 py-2 rounded-full bg-card border border-border text-foreground text-sm hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent" /> {s}
                </button>
              ))}
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative flex items-center gap-2 bg-card border border-border rounded-full p-2 shadow-sm">
                <button 
                  aria-label="Use voice input"
                  className="p-3 text-muted-foreground hover:bg-muted hover:text-primary rounded-full transition-colors"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about the election process..."
                  aria-label="Message for VoteWise AI"
                  className="flex-1 bg-transparent border-none outline-none px-2 text-foreground placeholder:text-muted-foreground/70"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-center mt-3 text-xs text-muted-foreground">
              VoteWise AI can make mistakes. Check official election portals for critical information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
