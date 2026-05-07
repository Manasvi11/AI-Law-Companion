import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, FileText, Image, Loader2, Leaf } from 'lucide-react';
import { analyzeDocument } from '@/lib/gemini';
import type { StructuredLegalResponse, UserSettings } from '@/types';
import { LegalResponseCard } from './LegalResponseCard';

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onAnalysisComplete: (response: StructuredLegalResponse, imageUrl: string) => void;
}

export function DocumentUpload({ isOpen, onClose, settings, onAnalysisComplete }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<StructuredLegalResponse | null>(null);
  const [prompt, setPrompt] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => { setSelectedImage(e.target?.result as string); setResult(null); };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    try {
      const response = await analyzeDocument(selectedImage, prompt || 'Explain this document simply', settings);
      setResult(response);
      onAnalysisComplete(response, selectedImage);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => { setSelectedImage(null); setResult(null); setPrompt(''); };

  const handleClose = () => { reset(); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--cream-300)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--sage-100)] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[var(--sage-500)]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[var(--forest-900)]">Document Assistant</h3>
                  <p className="text-xs text-[var(--sage-400)]">Upload or photograph any legal document</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 rounded-xl hover:bg-[var(--cream-100)] transition-colors">
                <X className="w-5 h-5 text-[var(--sage-400)]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-90px)] scrollbar-thin">
              {!selectedImage ? (
                <div
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                    dragActive ? 'border-[var(--sage-400)] bg-[var(--sage-50)]' : 'border-[var(--cream-300)] bg-[var(--cream-50)] hover:border-[var(--sage-300)]'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[var(--cream-200)] flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-[var(--sage-400)]" />
                  </div>
                  <h4 className="font-serif text-[var(--forest-900)] mb-1">
                    {dragActive ? 'Drop it here' : 'Upload a Document'}
                  </h4>
                  <p className="text-sm text-[var(--sage-400)] mb-6">Drag & drop or use the buttons</p>
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => fileRef.current?.click()} className="btn-ghost-sage text-sm flex items-center gap-2">
                      <Image className="w-4 h-4" /> Choose File
                    </button>
                    <button onClick={() => inputRef.current?.click()} className="btn-sage text-sm flex items-center gap-2">
                      <Camera className="w-4 h-4" /> Take Photo
                    </button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border border-[var(--cream-300)] bg-[var(--cream-50)]">
                    <img src={selectedImage} alt="Document preview" className="w-full max-h-[260px] object-contain" />
                    <button onClick={reset} className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {!result && (
                    <div className="space-y-3">
                      <textarea
                        value={prompt} onChange={e => setPrompt(e.target.value)}
                        placeholder="What do you want to know about this document?"
                        className="input-sage w-full resize-none" rows={3}
                      />
                      <button onClick={handleAnalyze} disabled={analyzing}
                        className="w-full btn-sage flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {analyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Leaf className="w-4 h-4" /> Explain This Document</>}
                      </button>
                    </div>
                  )}
                  {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <LegalResponseCard response={result} />
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
