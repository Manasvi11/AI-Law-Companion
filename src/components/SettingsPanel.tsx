import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClerk, useUser } from '@clerk/clerk-react';
import {
  X,
  Globe,
  Volume2,
  Bell,
  Leaf,
  LogOut,
  RotateCcw,
  Check,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { COUNTRIES, LANGUAGES } from '@/lib/data';
import type { UserSettings } from '@/types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onReset: () => void;
}

export function SettingsPanel({ isOpen, onClose, settings, onUpdateSettings, onReset }: SettingsPanelProps) {
  const [countryOpen, setCountryOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();

  const selectedCountry = COUNTRIES.find(c => c.code === settings.country);
  const selectedLang = LANGUAGES.find(l => l.code === settings.language);
  const displayName = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Student';
  const initials = displayName
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const availableLangs = selectedCountry
    ? LANGUAGES.filter(l => selectedCountry.languages.includes(l.code))
    : LANGUAGES;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--cream-300)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--sage-100)] flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[var(--sage-500)]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[var(--forest-900)]">Settings</h3>
                  <p className="text-xs text-[var(--sage-400)]">Customize your experience</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--cream-100)] transition-colors">
                <X className="w-5 h-5 text-[var(--sage-400)]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-80px)] scrollbar-thin">
              {/* Profile */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-300)]">
                <div className="flex items-center gap-3 min-w-0">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--sage-500)] text-white flex items-center justify-center text-xs font-semibold">
                      {initials || 'ST'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[var(--forest-900)] truncate">{displayName}</div>
                    <div className="text-xs text-[var(--sage-400)] truncate">Go</div>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ redirectUrl: '/' })}
                  className="p-2 rounded-xl hover:bg-white/70 transition-colors text-[var(--sage-500)]"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
              
              {/* Demo Mode */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--sage-50)] border border-[var(--sage-200)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--sage-100)] flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-[var(--sage-500)]" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[var(--forest-900)]">Demo Mode</div>
                    <div className="text-xs text-[var(--sage-400)]">Use built-in responses</div>
                  </div>
                </div>
                <Switch
                  checked={settings.useDemoMode}
                  onCheckedChange={(c) => onUpdateSettings({ useDemoMode: c })}
                />
              </div>

              {/* Country */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--forest-900)]">
                  <Globe className="w-4 h-4 text-[var(--sage-400)]" />
                  Country
                </label>
                <div className="relative">
                  <button
                    onClick={() => setCountryOpen(!countryOpen)}
                    className="input-sage w-full flex items-center justify-between text-left"
                  >
                    <span className="flex items-center gap-2">
                      {selectedCountry && <span className="text-lg">{selectedCountry.flag}</span>}
                      <span className={selectedCountry ? 'text-[var(--forest-900)]' : 'text-[var(--sage-300)]'}>
                        {selectedCountry?.name || 'Select country'}
                      </span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[var(--sage-400)] transition-transform ${countryOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {countryOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white rounded-2xl shadow-lg border border-[var(--cream-300)] z-10 scrollbar-thin">
                      {COUNTRIES.map(c => (
                        <button
                          key={c.code}
                          onClick={() => { onUpdateSettings({ country: c.code }); setCountryOpen(false); }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--sage-50)] text-left ${settings.country === c.code ? 'bg-[var(--sage-50)] text-[var(--sage-700)]' : ''}`}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span>{c.name}</span>
                          {settings.country === c.code && <Check className="w-4 h-4 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--forest-900)]">
                  <Globe className="w-4 h-4 text-[var(--sage-400)]" />
                  Language
                </label>
                <div className="relative">
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    className="input-sage w-full flex items-center justify-between text-left"
                  >
                    <span>
                      {selectedLang ? `${selectedLang.nativeName} (${selectedLang.name})` : 'Select language'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[var(--sage-400)] transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {langOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white rounded-2xl shadow-lg border border-[var(--cream-300)] z-10 scrollbar-thin">
                      {availableLangs.map(l => (
                        <button
                          key={l.code}
                          onClick={() => { onUpdateSettings({ language: l.code }); setLangOpen(false); }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--sage-50)] text-left ${settings.language === l.code ? 'bg-[var(--sage-50)]' : ''}`}
                        >
                          <span>{l.nativeName}</span>
                          <span className="text-[var(--sage-400)] text-xs">({l.name})</span>
                          {settings.language === l.code && <Check className="w-4 h-4 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-[var(--sage-400)]" />
                    <span className="text-sm font-medium text-[var(--forest-900)]">Voice Input</span>
                  </div>
                  <Switch checked={settings.voiceEnabled} onCheckedChange={c => onUpdateSettings({ voiceEnabled: c })} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--cream-50)] border border-[var(--cream-200)]">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-[var(--sage-400)]" />
                    <span className="text-sm font-medium text-[var(--forest-900)]">Notifications</span>
                  </div>
                  <Switch checked={settings.notifications} onCheckedChange={c => onUpdateSettings({ notifications: c })} />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-2xl bg-[var(--cream-100)] border border-[var(--cream-300)] flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[var(--terra-500)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--sage-500)] leading-relaxed">
                  RightSpeak is for educational purposes only. It does not replace a lawyer. Always consult a qualified attorney.
                </p>
              </div>

              {/* Reset */}
              <button
                onClick={onReset}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[var(--cream-300)] text-sm text-[var(--sage-500)] hover:bg-[var(--cream-50)] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
