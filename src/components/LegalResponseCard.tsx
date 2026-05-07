import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  BookOpen,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { StructuredLegalResponse } from '@/types';

interface LegalResponseCardProps {
  response: StructuredLegalResponse;
}

function getSourceUrl(url?: string) {
  return url && url.startsWith('http') ? url : undefined;
}

function Section({
  icon: Icon,
  title,
  color,
  bgColor,
  borderColor,
  children,
  defaultOpen = true,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-2xl overflow-hidden border ${borderColor}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-3.5 ${bgColor}`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-sm text-[var(--forest-900)]">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[var(--sage-400)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--sage-400)]" />
        )}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3.5"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export function LegalResponseCard({ response }: LegalResponseCardProps) {
  return (
    <div className="space-y-3">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[var(--sage-100)] to-[var(--cream-200)] border border-[var(--sage-200)] rounded-2xl p-4"
      >
        <p className="text-sm text-[var(--forest-800)] leading-relaxed">{response.summary}</p>
      </motion.div>

      {/* What You Can Do */}
      {response.dos.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Section
            icon={CheckCircle2}
            title="What You Can Do"
            color="bg-[#d4e4c4] text-[#5a7a3a]"
            bgColor="bg-[#f0f5ea]"
            borderColor="border-[#d4e4c4]"
          >
            <div className="space-y-2.5">
              {response.dos.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#7a9a5a] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--forest-800)] leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </Section>
        </motion.div>
      )}

      {/* What NOT To Do */}
      {response.donts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Section
            icon={XCircle}
            title="What NOT To Do"
            color="bg-[#e8d0c8] text-[#8a5a4a]"
            bgColor="bg-[#faf0ec]"
            borderColor="border-[#e8d0c8]"
          >
            <div className="space-y-2.5">
              {response.donts.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5"
                >
                  <XCircle className="w-4 h-4 text-[#aa6a5a] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--forest-800)] leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </Section>
        </motion.div>
      )}

      {/* Possible Outcomes */}
      {response.outcomes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Section
            icon={AlertTriangle}
            title="What Might Happen"
            color="bg-[#d0d8e8] text-[#4a5a7a]"
            bgColor="bg-[#eceff5]"
            borderColor="border-[#d0d8e8]"
          >
            <div className="space-y-2.5">
              {response.outcomes.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-[#c8d0e0] text-[#5a6a8a] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-sm text-[var(--forest-800)] leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </Section>
        </motion.div>
      )}

      {/* Your Rights */}
      {response.rights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Section
            icon={Shield}
            title="Your Rights"
            color="bg-[#c8d8d0] text-[#4a6a5a]"
            bgColor="bg-[#eaf0ec]"
            borderColor="border-[#c8d8d0]"
          >
            <div className="space-y-2.5">
              {response.rights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5"
                >
                  <Shield className="w-4 h-4 text-[var(--sage-500)] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--forest-800)] leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </Section>
        </motion.div>
      )}

      {/* Relevant Laws */}
      {response.laws.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Section
            icon={Scale}
            title="Laws That Protect You"
            color="bg-[var(--cream-300)] text-[var(--terra-500)]"
            bgColor="bg-[var(--cream-100)]"
            borderColor="border-[var(--cream-300)]"
            defaultOpen={false}
          >
            <div className="space-y-2">
              {response.laws.map((law, i) => (
                <motion.a
                  key={i}
                  href={getSourceUrl(law.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`block p-3 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] ${law.url ? '' : 'pointer-events-none'}`}
                >
                  <div className="flex items-start gap-2.5">
                    <Scale className="w-4 h-4 text-[var(--sage-500)] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[var(--forest-900)]">{law.name}</div>
                      <div className="text-xs text-[var(--sage-500)] mt-0.5">{law.description}</div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </Section>
        </motion.div>
      )}

      {/* Related Cases */}
      {response.cases.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Section
            icon={BookOpen}
            title="Similar Cases"
            color="bg-[var(--cream-300)] text-[var(--terra-500)]"
            bgColor="bg-[var(--cream-100)]"
            borderColor="border-[var(--cream-300)]"
            defaultOpen={false}
          >
            <div className="space-y-2">
              {response.cases.map((c, i) => (
                <motion.a
                  key={i}
                  href={getSourceUrl(c.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`block p-3 rounded-xl bg-[var(--cream-50)] border border-[var(--cream-200)] ${c.url ? '' : 'pointer-events-none'}`}
                >
                  <div className="flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-[var(--sage-500)] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[var(--forest-900)]">{c.title}</div>
                      <div className="text-xs text-[var(--sage-500)] mt-0.5">{c.description}</div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </Section>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="bg-[var(--cream-100)] border border-[var(--cream-300)] rounded-2xl p-3.5 flex items-start gap-2.5"
      >
        <AlertTriangle className="w-4 h-4 text-[var(--terra-500)] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[var(--sage-500)] leading-relaxed">{response.disclaimer}</p>
      </motion.div>
    </div>
  );
}
