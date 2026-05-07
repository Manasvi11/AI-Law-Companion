import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  Leaf,
} from 'lucide-react';
import { SAMPLE_CONVERSATIONS } from '@/lib/data';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ isOpen, onToggle, onNewChat, onOpenSettings }: SidebarProps) {
  const chats = SAMPLE_CONVERSATIONS.map((c, i) => ({ ...c, id: `chat-${i}` }));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full z-50 overflow-hidden bg-[var(--forest-900)] text-[var(--cream-200)] shadow-2xl"
      >
        <div className="w-[280px] h-full flex flex-col">
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-white/8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--sage-500)] flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-lg text-[var(--cream-100)]">RightSpeak</span>
            </div>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat */}
          <div className="p-4">
            <button
              onClick={onNewChat}
              className="w-full py-3 rounded-2xl bg-[var(--sage-600)] hover:bg-[var(--sage-500)] text-white font-medium transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          {/* Recent Chats */}
          <div className="flex-1 overflow-y-auto px-3 scrollbar-thin">
            <div className="mb-3 px-3 text-[10px] font-medium text-white/25 uppercase tracking-widest">
              Recent
            </div>
            <div className="space-y-1">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  className="w-full text-left p-3 rounded-xl transition-all group hover:bg-white/5 border border-transparent"
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-white/30 group-hover:text-[var(--sage-400)] transition-colors" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white/70 group-hover:text-white truncate transition-colors">
                        {chat.title}
                      </div>
                      <div className="text-xs text-white/30 truncate mt-0.5">{chat.preview}</div>
                      <div className="flex items-center gap-1 mt-1.5 text-[10px] text-white/20">
                        <Clock className="w-3 h-3" />
                        {chat.time}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/8 space-y-1">
            <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-white/50 hover:text-white"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-white/20">
              <Leaf className="w-3 h-3 text-[var(--sage-500)]" />
              <span>Your Legal Buddy</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Desktop toggle */}
      <button
        onClick={onToggle}
        className={`fixed z-50 top-4 transition-all duration-300 hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-[var(--forest-900)] text-[var(--cream-200)] shadow-lg hover:bg-[var(--forest-800)] ${
          isOpen ? 'left-[284px]' : 'left-4'
        }`}
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </>
  );
}
