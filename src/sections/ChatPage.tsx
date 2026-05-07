import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  ImagePlus,
  Menu,
  Leaf,
  ArrowRight,
  Loader2,
  Home,
  Briefcase,
  Car,
  CreditCard,
  Users,
  Smartphone,
  FileText,
  Shield,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/ChatMessage';
import { DocumentUpload } from '@/components/DocumentUpload';
import { VoiceInput, VoiceButton } from '@/components/VoiceInput';
import { streamLegalResponse } from '@/lib/gemini';
import { QUICK_TOPICS } from '@/lib/data';
import type { Message, UserSettings, StructuredLegalResponse } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Home, Briefcase, Car, CreditCard, Users, Smartphone, Shield, FileText,
};

interface ChatPageProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  settings: UserSettings;
}

export function ChatPage({ onToggleSidebar, onOpenSettings, settings }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documentUploadOpen, setDocumentUploadOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = settings.language === 'en' ? 'en-US' : settings.language;

      recognitionRef.current.onresult = (event: any) => {
        let t = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          t += event.results[i][0].transcript;
        }
        setVoiceTranscript(t);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [settings.language]);

  const handleSend = useCallback(async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingId, role: 'model', content: '', timestamp: new Date(), isLoading: true,
    }]);

    const allMessages = [...messages, userMessage];
    let fullText = '';
    let structuredResponse: StructuredLegalResponse | undefined;

    try {
      for await (const chunk of streamLegalResponse(allMessages, settings)) {
        fullText = chunk.text;
        if (chunk.structured) structuredResponse = chunk.structured;
        if (chunk.done) break;
        setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, content: fullText, isLoading: false } : m));
      }

      setMessages(prev => prev.map(m =>
        m.id === loadingId
          ? { ...m, content: fullText, isLoading: false, structuredResponse: structuredResponse || undefined }
          : m
      ));
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === loadingId
          ? { ...m, content: 'Sorry, something went wrong. Let me try again.', isLoading: false }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, settings]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setVoiceTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleVoiceSubmit = (text: string) => {
    handleSend(text);
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  const handleDocumentAnalysis = (response: StructuredLegalResponse, imageUrl: string) => {
    setMessages(prev => [...prev,
      { id: Date.now().toString(), role: 'user', content: 'Please explain this document.', timestamp: new Date(), imageUrl },
      { id: (Date.now() + 1).toString(), role: 'model', content: response.summary, timestamp: new Date(), structuredResponse: response },
    ]);
    setDocumentUploadOpen(false);
  };

  const countryFlag = settings.country
    ? new Intl.DisplayNames(['en'], { type: 'region' }).of(settings.country)
    : '';

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-nature-gradient relative">
      {/* Subtle nature bg overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'url(/nature-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Header */}
      <header className="relative flex items-center justify-between px-4 py-3 glass-strong border-b border-[var(--cream-300)] shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="p-2 rounded-xl hover:bg-[var(--sage-100)] transition-colors">
            <Menu className="w-5 h-5 text-[var(--forest-800)]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--forest-800)] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[var(--sage-300)]" />
            </div>
            <div>
              <h1 className="font-serif text-[var(--forest-900)] text-sm">RightSpeak</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--sage-400)]" />
                <span className="text-[10px] text-[var(--sage-400)]">
                  {settings.country ? `${countryFlag} ${settings.country}` : 'Your Legal Buddy'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenSettings} className="p-2 rounded-xl hover:bg-[var(--sage-100)] transition-colors text-[var(--sage-500)]" title="Settings">
            <Leaf className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="relative flex-1 overflow-hidden z-10">
        {!hasMessages ? (
          <div className="h-full overflow-y-auto scrollbar-thin">
            <div className="flex flex-col items-center justify-center min-h-full px-4 py-10">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center mb-6"
              >
                <img src="/logo-scale.png" alt="RightSpeak" className="w-16 h-16 mx-auto mb-3 float-gentle" />
                <h2 className="font-serif text-2xl text-[var(--forest-900)] mb-1">
                  Hey there
                </h2>
                <p className="text-sm text-[var(--sage-500)] max-w-xs mx-auto">
                  Tell me what's going on. I'll break it down in plain words.
                </p>
              </motion.div>

              <div className="w-full max-w-lg">
                <p className="text-[10px] font-medium text-[var(--sage-400)] uppercase tracking-widest mb-3 text-center">
                  Common Topics
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_TOPICS.map((topic, i) => {
                    const IconComponent = iconMap[topic.icon] || Shield;
                    return (
                      <motion.button
                        key={topic.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleSend(`Help with ${topic.label.toLowerCase()}`)}
                        className="flex items-center gap-3 p-3 rounded-2xl card-glass text-left group"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${topic.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-[var(--forest-900)]">{topic.label}</div>
                          <div className="text-[11px] text-[var(--sage-400)] truncate">{topic.description}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--sage-300)] group-hover:text-[var(--sage-500)] transition-colors" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full px-4 py-5">
            <div className="max-w-2xl mx-auto space-y-5">
              {messages.map((message, index) => (
                <ChatMessage key={message.id} message={message} index={index} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input */}
      <div className="relative border-t border-[var(--cream-300)] glass-strong px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2">
            <button
              onClick={() => setDocumentUploadOpen(true)}
              className="p-2.5 rounded-xl bg-[var(--cream-100)] text-[var(--sage-500)] hover:bg-[var(--sage-100)] hover:text-[var(--sage-700)] transition-all flex-shrink-0"
              title="Upload document"
            >
              <ImagePlus className="w-5 h-5" />
            </button>

            {settings.voiceEnabled && (
              <VoiceButton onClick={toggleListening} isListening={isListening} />
            )}

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What's going on? Tell me your situation..."
                className="w-full p-3 pr-12 rounded-2xl border border-[var(--cream-300)] text-sm resize-none outline-none focus:border-[var(--sage-400)] focus:ring-2 focus:ring-[var(--sage-200)] max-h-[120px] scrollbar-thin bg-white/70"
                rows={1}
                disabled={isLoading}
              />
              {input.trim() && (
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-[var(--sage-500)] text-white hover:bg-[var(--sage-600)] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`py-2.5 px-4 rounded-full font-medium text-sm flex-shrink-0 transition-all ${
                input.trim() && !isLoading
                  ? 'bg-[var(--sage-500)] text-white hover:bg-[var(--sage-600)] shadow-md'
                  : 'bg-[var(--cream-200)] text-[var(--sage-300)] cursor-not-allowed'
              }`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[9px] text-[var(--sage-400)] mt-2 text-center">
            RightSpeak is your AI buddy, not a lawyer. For legal advice, consult a qualified attorney.
          </p>
        </div>
      </div>

      <DocumentUpload
        isOpen={documentUploadOpen}
        onClose={() => setDocumentUploadOpen(false)}
        settings={settings}
        onAnalysisComplete={handleDocumentAnalysis}
      />

      <VoiceInput
        isListening={isListening}
        onStopListening={() => { setIsListening(false); recognitionRef.current?.stop(); }}
        transcript={voiceTranscript}
        onTranscriptChange={setVoiceTranscript}
        onSubmit={handleVoiceSubmit}
      />
    </div>
  );
}
