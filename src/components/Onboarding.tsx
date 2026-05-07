import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Shield, BookOpen, Lightbulb, Target, ChevronDown } from 'lucide-react';
import { COUNTRIES, LANGUAGES } from '@/lib/data';

interface OnboardingProps {
  onComplete: (country: string, language: string, interests: string[]) => void;
}

const INTEREST_OPTIONS = [
  { id: 'rights', label: 'My Rights', description: 'What protections I have', icon: Shield },
  { id: 'laws', label: 'Laws & Articles', description: 'Which laws apply to me', icon: BookOpen },
  { id: 'solutions', label: 'Solutions', description: 'What I can do about it', icon: Lightbulb },
  { id: 'outcomes', label: 'Possible Outcomes', description: 'What might happen next', icon: Target },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['solutions', 'rights']);
  const [countryDropdown, setCountryDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry);
  const selectedLangData = LANGUAGES.find(l => l.code === selectedLanguage);
  
  const availableLanguages = selectedCountryData
    ? LANGUAGES.filter(l => selectedCountryData.languages.includes(l.code))
    : LANGUAGES;

  const filteredCountries = searchQuery
    ? COUNTRIES.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : COUNTRIES;

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 0 && selectedCountry) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else if (step === 2 && selectedInterests.length > 0) {
      onComplete(selectedCountry, selectedLanguage, selectedInterests);
    }
  };

  const canProceed = step === 0 ? selectedCountry : step === 2 ? selectedInterests.length > 0 : true;

  return (
    <div className="min-h-screen w-full bg-nature-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Nature Image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/nature-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[var(--sage-300)] opacity-30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo-scale.png" alt="RightSpeak" className="w-12 h-12" />
          <span className="font-serif text-2xl text-[var(--forest-900)]">RightSpeak</span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? 'w-8 bg-[var(--sage-500)]' : 'w-4 bg-[var(--sage-200)]'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 shadow-xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-serif text-2xl text-[var(--forest-900)] mb-2">
                  Where are you from?
                </h2>
                <p className="text-sm text-[var(--sage-500)] mb-6">
                  This helps us give you accurate, country-specific guidance.
                </p>

                {/* Country Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search your country..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCountryDropdown(true); }}
                    onFocus={() => setCountryDropdown(true)}
                    className="input-sage w-full"
                  />
                  {countryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white rounded-2xl shadow-lg border border-[var(--cream-300)] z-50 scrollbar-thin">
                      {filteredCountries.map(country => (
                        <button
                          key={country.code}
                          onClick={() => { 
                            setSelectedCountry(country.code); 
                            setSelectedLanguage(country.languages[0]);
                            setCountryDropdown(false); 
                            setSearchQuery(country.name);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--sage-50)] transition-colors text-left ${
                            selectedCountry === country.code ? 'bg-[var(--sage-50)]' : ''
                          }`}
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="text-[var(--forest-900)]">{country.name}</span>
                          {selectedCountry === country.code && (
                            <Check className="w-4 h-4 text-[var(--sage-500)] ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Country Display */}
                {selectedCountryData && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)]"
                  >
                    <span className="text-xl">{selectedCountryData.flag}</span>
                    <span className="text-sm font-medium text-[var(--forest-900)]">{selectedCountryData.name}</span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-serif text-2xl text-[var(--forest-900)] mb-2">
                  What language?
                </h2>
                <p className="text-sm text-[var(--sage-500)] mb-6">
                  Choose your preferred language for responses.
                </p>

                <div className="relative">
                  <button
                    onClick={() => setLangDropdown(!langDropdown)}
                    className="input-sage w-full flex items-center justify-between text-left"
                  >
                    <span className={selectedLangData ? 'text-[var(--forest-900)]' : 'text-[var(--sage-300)]'}>
                      {selectedLangData ? `${selectedLangData.nativeName} (${selectedLangData.name})` : 'Select language'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[var(--sage-400)] transition-transform ${langDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {langDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white rounded-2xl shadow-lg border border-[var(--cream-300)] z-50 scrollbar-thin">
                      {availableLanguages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => { setSelectedLanguage(lang.code); setLangDropdown(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--sage-50)] transition-colors text-left ${
                            selectedLanguage === lang.code ? 'bg-[var(--sage-50)]' : ''
                          }`}
                        >
                          <span className="text-[var(--forest-900)]">{lang.nativeName}</span>
                          <span className="text-[var(--sage-400)] text-xs">({lang.name})</span>
                          {selectedLanguage === lang.code && (
                            <Check className="w-4 h-4 text-[var(--sage-500)] ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-serif text-2xl text-[var(--forest-900)] mb-2">
                  What do you want to know?
                </h2>
                <p className="text-sm text-[var(--sage-500)] mb-6">
                  Pick what matters most to you. We'll tailor our answers.
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {INTEREST_OPTIONS.map(option => {
                    const isSelected = selectedInterests.includes(option.id);
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleInterest(option.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                          isSelected 
                            ? 'border-[var(--sage-400)] bg-[var(--sage-50)]' 
                            : 'border-[var(--cream-300)] bg-white/50 hover:border-[var(--sage-200)]'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[var(--sage-500)]' : 'bg-[var(--cream-200)]'
                        }`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[var(--sage-400)]'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-[var(--forest-900)]">{option.label}</div>
                          <div className="text-xs text-[var(--sage-500)]">{option.description}</div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[var(--sage-500)] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-ghost-sage flex-1"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex-1 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                canProceed 
                  ? 'btn-sage' 
                  : 'bg-[var(--cream-300)] text-[var(--sage-300)] cursor-not-allowed'
              }`}
            >
              {step === 2 ? 'Get Started' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--sage-400)] mt-6">
          Your Legal Buddy — Not a Lawyer
        </p>
      </motion.div>
    </div>
  );
}
