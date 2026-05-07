export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  structuredResponse?: StructuredLegalResponse;
  imageUrl?: string;
  isLoading?: boolean;
}

export interface StructuredLegalResponse {
  summary: string;
  dos: string[];
  donts: string[];
  outcomes: string[];
  rights: string[];
  laws: { name: string; description: string; url?: string }[];
  cases: { title: string; description: string; url?: string }[];
  disclaimer: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  country: string;
  language: string;
  useDemoMode: boolean;
  voiceEnabled: boolean;
  notifications: boolean;
  interests: string[];
  hasCompletedOnboarding: boolean;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  languages: string[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export type InputMode = 'text' | 'voice';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}
