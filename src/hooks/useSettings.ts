import { useState, useEffect, useCallback } from 'react';
import type { UserSettings } from '@/types';

const DEFAULT_SETTINGS: UserSettings = {
  country: '',
  language: 'en',
  useDemoMode: false,
  voiceEnabled: true,
  notifications: true,
  interests: [],
  hasCompletedOnboarding: false,
};

const STORAGE_KEY = 'rightspeak_settings';

export function useSettings() {
  const [settings, setSettingsState] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettingsState(prev => ({ ...prev, ...partial }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
  }, []);

  const completeOnboarding = useCallback((country: string, language: string, interests: string[]) => {
    setSettingsState(prev => ({
      ...prev,
      country,
      language,
      interests,
      hasCompletedOnboarding: true,
    }));
  }, []);

  return { settings, setSettings, resetSettings, completeOnboarding };
}
