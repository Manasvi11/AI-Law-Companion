import { motion } from 'framer-motion';
import { User, Leaf } from 'lucide-react';
import type { Message } from '@/types';
import { LegalResponseCard } from './LegalResponseCard';

interface ChatMessageProps {
  message: Message;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser
          ? 'bg-[var(--sage-400)]'
          : 'bg-[var(--forest-800)]'
      }`}>
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <Leaf className="w-3.5 h-3.5 text-[var(--sage-300)]" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isUser ? 'max-w-[80%]' : 'max-w-[92%]'}`}>
        <div className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-[11px] font-medium text-[var(--sage-500)]">
            {isUser ? 'You' : 'RightSpeak'}
          </span>
          <span className="text-[10px] text-[var(--sage-300)]">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {isUser ? (
          <div className="bg-[var(--sage-400)] text-white rounded-2xl rounded-tr-sm px-4 py-3 inline-block shadow-sm">
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Uploaded"
                className="rounded-xl mb-2 max-h-[180px] object-contain"
              />
            )}
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        ) : (
          <div>
            {message.isLoading ? (
              <div className="bg-white/70 backdrop-blur-sm border border-[var(--cream-300)] rounded-2xl rounded-tl-sm px-5 py-5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--sage-400)] typing-dot-sage" />
                    <div className="w-2 h-2 rounded-full bg-[var(--sage-400)] typing-dot-sage" />
                    <div className="w-2 h-2 rounded-full bg-[var(--sage-400)] typing-dot-sage" />
                  </div>
                  <span className="text-xs text-[var(--sage-400)]">Thinking...</span>
                </div>
              </div>
            ) : message.structuredResponse ? (
              <LegalResponseCard response={message.structuredResponse} />
            ) : (
              <div className="bg-white/70 backdrop-blur-sm border border-[var(--cream-300)] rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-[var(--forest-900)] leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
