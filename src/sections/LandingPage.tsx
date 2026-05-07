import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import {
  CheckCircle2,
  Leaf,
  Globe,
  MessageSquare,
  FileText,
  Mic,
  Lock,
  Heart,
  Zap,
  TrendingUp,
  ChevronDown,
  Shield,
} from 'lucide-react';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    const dur = 2000, steps = 60, inc = target / steps;
    let c = 0;
    const t = setInterval(() => {
      c += inc;
      setCount(c >= target ? target : Math.floor(c));
    }, dur / steps);
    return () => clearInterval(t);
  }, [isInView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

import { useState, useEffect } from 'react';

interface LandingPageProps {
  onStartChat: () => void;
}

export function LandingPage({ onStartChat }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const features = [
    { icon: MessageSquare, title: 'Simple Chat', desc: 'Talk naturally. No legal jargon. Just clear answers.', color: 'bg-[#d4e4c4] text-[#5a7a3a]' },
    { icon: FileText, title: 'Document Help', desc: 'Upload any document. We explain what it means.', color: 'bg-[#e8d8c8] text-[#7a5a3a]' },
    { icon: Mic, title: 'Voice Input', desc: 'Too stressed to type? Just speak. We listen.', color: 'bg-[#c8d8d0] text-[#4a6a5a]' },
    { icon: Globe, title: '25+ Languages', desc: 'Get help in your language, wherever you are.', color: 'bg-[#d0d8e8] text-[#4a5a7a]' },
    { icon: Shield, title: 'Know Your Rights', desc: 'Learn what protections you have in your country.', color: 'bg-[#e0d0e0] text-[#6a4a6a]' },
    { icon: Lock, title: 'Private & Secure', desc: 'Your conversations stay private. Always.', color: 'bg-[#c8d0d0] text-[#3a5a5a]' },
  ];

  const steps = [
    { num: '1', title: 'Tell us what happened', desc: 'Describe your situation in your own words. No need to be formal.', icon: MessageSquare },
    { num: '2', title: 'Get clear guidance', desc: 'We break down your options into simple dos and donts.', icon: CheckCircle2 },
    { num: '3', title: 'Take action confidently', desc: 'Know your rights, understand the laws, and move forward.', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[var(--cream-100)] overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-[var(--cream-300)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo-scale.png" alt="RightSpeak" className="w-8 h-8" />
            <span className="font-serif text-xl text-[var(--forest-900)]">RightSpeak</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[var(--sage-600)]">
            <a href="#how-it-works" className="hover:text-[var(--forest-900)] transition-colors">How It Works</a>
            <a href="#stories" className="hover:text-[var(--forest-900)] transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hidden sm:inline-flex text-sm text-[var(--sage-600)] hover:text-[var(--forest-900)] transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-sage text-sm py-2.5 px-6">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button onClick={onStartChat} className="btn-sage text-sm py-2.5 px-6">
                Open Chat
              </button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--sage-100)] border border-[var(--sage-200)] text-[var(--sage-600)] text-xs font-medium mb-6">
                <Leaf className="w-3.5 h-3.5" />
                Your Legal Buddy
              </div>
              <h1 className="font-serif text-4xl lg:text-5xl text-[var(--forest-900)] leading-tight mb-5">
                Know Your Rights,{' '}
                <span className="text-gradient-sage">Without the Confusion</span>
              </h1>
              <p className="text-[var(--sage-500)] leading-relaxed mb-8 max-w-md text-[15px]">
                RightSpeak helps everyday people understand laws, documents, and their legal situations 
                in simple, clear language. No lawyer needed to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="btn-sage flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Start Chatting
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <button onClick={onStartChat} className="btn-sage flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Start Chatting
                  </button>
                </SignedIn>
                <button onClick={onStartChat} className="btn-ghost-sage flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Upload a Document
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-[var(--cream-300)]">
                <div>
                  <div className="text-2xl font-serif text-[var(--forest-900)]"><AnimatedCounter target={50} suffix="K+" /></div>
                  <div className="text-xs text-[var(--sage-400)] mt-1">People Helped</div>
                </div>
                <div>
                  <div className="text-2xl font-serif text-[var(--forest-900)]"><AnimatedCounter target={25} suffix="+" /></div>
                  <div className="text-xs text-[var(--sage-400)] mt-1">Languages</div>
                </div>
                <div>
                  <div className="text-2xl font-serif text-[var(--forest-900)]"><AnimatedCounter target={20} suffix="+" /></div>
                  <div className="text-xs text-[var(--sage-400)] mt-1">Countries</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative">
              <div className="relative rounded-[2rem] overflow-hidden shadow-xl">
                <img src="/hero-nature.jpg" alt="Person understanding their rights peacefully" className="w-full h-auto" />
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#d4e4c4] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#5a7a3a]" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-[var(--forest-900)]">Rights Explained</div>
                    <div className="text-xs text-[var(--sage-400)]">In plain language</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-[var(--sage-300)]" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[var(--cream-50)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-serif text-3xl text-[var(--forest-900)] mb-3">Everything You Need</h2>
            <p className="text-[var(--sage-500)] max-w-md mx-auto text-sm">
              RightSpeak makes the law accessible to everyone.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="card-glass p-6 group"
              >
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[var(--forest-900)] mb-1.5 text-[15px]">{f.title}</h3>
                <p className="text-sm text-[var(--sage-500)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="/feature-doc.jpg" alt="Document help" className="rounded-[2rem] shadow-lg w-full" />
            </motion.div>
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
                <h2 className="font-serif text-3xl text-[var(--forest-900)] mb-3">How It Works</h2>
                <p className="text-[var(--sage-500)] text-sm">Three simple steps to clarity.</p>
              </motion.div>
              <div className="space-y-7">
                {steps.map((s, i) => (
                  <motion.div key={s.num} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[var(--sage-400)] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{s.num}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--forest-900)] mb-1 text-[15px]">{s.title}</h3>
                      <p className="text-sm text-[var(--sage-500)] leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global */}
      <section className="py-20 bg-[var(--forest-900)] text-[var(--cream-200)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--sage-600)]/30 border border-[var(--sage-500)]/30 text-[var(--sage-300)] text-xs font-medium mb-6">
                  <Globe className="w-3.5 h-3.5" />
                  Global Access
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl mb-5">
                  Legal Help in <span className="text-[var(--sage-300)]">Your Language</span>
                </h2>
                <p className="text-[var(--sage-400)] leading-relaxed mb-8 text-sm">
                  Language should never be a barrier to understanding your rights. We support 
                  25+ languages and adapt to your country's laws.
                </p>
                <button onClick={onStartChat} className="btn-sage flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Select Your Country
                </button>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="/feature-global.jpg" alt="Global coverage" className="rounded-[2rem] shadow-xl w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="stories" className="py-20 bg-[var(--cream-50)] scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-serif text-3xl text-[var(--forest-900)] mb-3">Real Stories</h2>
            <p className="text-[var(--sage-500)] text-sm">See how RightSpeak has helped.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Priya Sharma', role: 'Tenant in Mumbai', quote: 'My landlord was refusing to return my security deposit. RightSpeak explained exactly what my rights were. I got it back within a week!' },
              { name: 'Marcus Johnson', role: 'Restaurant Worker', quote: 'I was unfairly fired and didn\'t know what to do. This app broke down my rights in simple terms and helped me understand I had a case.' },
              { name: 'Elena Rodriguez', role: 'College Student', quote: 'I received a legal notice I couldn\'t understand. I uploaded it to RightSpeak and they explained everything clearly. Such a relief!' },
            ].map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="card-glass p-6">
                <p className="text-sm text-[var(--forest-800)] leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-sm text-[var(--forest-900)]">{t.name}</div>
                  <div className="text-xs text-[var(--sage-400)]">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-serif text-3xl text-[var(--forest-900)] mb-3">Why People Trust RightSpeak</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Made for Real People', desc: 'No legal background needed.' },
              { icon: Zap, title: 'Instant Answers', desc: 'Get clarity in seconds.' },
              { icon: TrendingUp, title: 'Actionable Guidance', desc: 'Clear dos and donts.' },
              { icon: Lock, title: 'Always Honest', desc: 'If we don\'t know, we say so.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-5">
                <div className="w-13 h-13 rounded-2xl bg-[var(--sage-100)] flex items-center justify-center mx-auto mb-4 w-12 h-12">
                  <item.icon className="w-6 h-6 text-[var(--sage-500)]" />
                </div>
                <h3 className="font-semibold text-[var(--forest-900)] mb-1.5 text-sm">{item.title}</h3>
                <p className="text-sm text-[var(--sage-500)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--forest-900)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <img src="/logo-scale.png" alt="RightSpeak" className="w-16 h-16 mx-auto mb-6 float-gentle" />
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--cream-100)] mb-5">
              Don't Stay in the Dark About <span className="text-[var(--sage-300)]">Your Rights</span>
            </h2>
            <p className="text-[var(--sage-400)] text-[15px] mb-8 max-w-lg mx-auto leading-relaxed">
              Whether it's a landlord issue, workplace problem, or a confusing document — 
              RightSpeak is here to help you understand and take action.
            </p>
            <button onClick={onStartChat} className="btn-sage flex items-center gap-2 mx-auto text-base px-10 py-4">
              <MessageSquare className="w-5 h-5" />
              Start Chatting Now
            </button>
            <p className="text-[var(--sage-600)] text-xs mt-5">Free to use. No account needed.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--forest-900)] border-t border-white/8 text-[var(--sage-500)] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo-scale.png" alt="RightSpeak" className="w-7 h-7" />
              <span className="font-serif text-[var(--cream-200)]">RightSpeak</span>
            </div>
            <p className="text-xs text-center">
              Your AI Legal Buddy. Not a substitute for professional legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
