import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  isListening: boolean;
  onStopListening: () => void;
  transcript: string;
  onTranscriptChange: (text: string) => void;
  onSubmit: (text: string) => void;
}

export function VoiceInput({
  isListening,
  onStopListening,
  transcript,
  onTranscriptChange,
  onSubmit,
}: VoiceInputProps) {
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(20).fill(5));
  const [showTranscript, setShowTranscript] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isListening) {
      setShowTranscript(true);
      const animate = () => {
        setVisualizerData(
          Array(20)
            .fill(0)
            .map(() => Math.random() * 40 + 5)
        );
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setVisualizerData(Array(20).fill(5));
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening]);

  const handleSubmit = () => {
    if (transcript.trim()) {
      onSubmit(transcript.trim());
      onTranscriptChange('');
      setShowTranscript(false);
    }
  };

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-[90%] max-w-lg"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Visualizer */}
            <div className="flex items-end gap-1 h-16">
              {visualizerData.map((height, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${height}px` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-1.5 rounded-full bg-amber-500"
                />
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-amber-600">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium">Listening...</span>
            </div>

            {/* Transcript */}
            {showTranscript && transcript && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 max-h-32 overflow-y-auto"
              >
                {transcript}
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={onStopListening}
                className="p-3 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
              >
                <Square className="w-5 h-5" />
              </button>
              {transcript.trim() && (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-full bg-amber-500 text-slate-900 font-semibold hover:bg-amber-600 transition-colors"
                >
                  Send
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Voice button for the chat input
interface VoiceButtonProps {
  onClick: () => void;
  isListening: boolean;
}

export function VoiceButton({ onClick, isListening }: VoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
        isListening
          ? 'bg-[var(--sage-500)] text-white'
          : 'bg-[var(--cream-100)] text-[var(--sage-500)] hover:bg-[var(--sage-100)] hover:text-[var(--sage-700)]'
      }`}
      title="Voice input"
    >
      {isListening ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
}
