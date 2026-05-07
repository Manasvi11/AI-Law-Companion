# RightSpeak — Technical Documentation

## 1. Where to Add API Keys

### Current: Google Gemini (Default)

**File:** `src/lib/gemini.ts`

**How to add your key:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a free API key
3. Open RightSpeak app → Settings (leaf icon in chat header)
4. Paste key in "Gemini API Key" field
5. Toggle OFF "Demo Mode"
6. You're live!

**Free tier:** 1,500 requests/day for gemini-2.0-flash

### Switching to a Different Model

#### Option A: OpenAI GPT-4o / GPT-3.5

**Step 1:** Edit `src/lib/gemini.ts` — rename it to `src/lib/ai.ts`

**Step 2:** Replace the API call:

```typescript
// OLD (Gemini):
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${settings.geminiApiKey}`,
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: apiMessages }) }
);

// NEW (OpenAI):
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${settings.openaiApiKey}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini', // or 'gpt-4o', 'gpt-3.5-turbo'
    messages: apiMessages,
    stream: true,
  }),
});
```

**Step 3:** Add `openaiApiKey` to settings in `src/types/index.ts`:

```typescript
export interface UserSettings {
  // ... existing fields
  openaiApiKey: string;
  geminiApiKey: string; // keep both
  aiProvider: 'gemini' | 'openai';
}
```

**Step 4:** Add provider toggle in Settings panel (`src/components/SettingsPanel.tsx`)

#### Option B: Anthropic Claude

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': settings.anthropicApiKey,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-3-haiku-20240307', // or 'claude-3-sonnet'
    max_tokens: 1500,
    messages: apiMessages,
    stream: true,
  }),
});
```

#### Option C: Multiple Models (Recommended Architecture)

Create `src/lib/ai-provider.ts`:

```typescript
export interface AIProvider {
  name: string;
  stream(messages: Message[], settings: UserSettings): AsyncGenerator<...>;
}

export const providers: Record<string, AIProvider> = {
  gemini: {
    name: 'Google Gemini',
    stream: streamGeminiResponse,
  },
  openai: {
    name: 'OpenAI',
    stream: streamOpenAIResponse,
  },
  anthropic: {
    name: 'Anthropic Claude',
    stream: streamClaudeResponse,
  },
};
```

Then in `src/lib/gemini.ts`, export each streaming function separately:

```typescript
// gemini.ts → rename to ai-providers.ts
export async function* streamGeminiResponse(...) { ... }
export async function* streamOpenAIResponse(...) { ... }
export async function* streamClaudeResponse(...) { ... }
```

---

## 2. Architecture

```
rightspeak/
├── public/                    # Static assets
│   ├── hero-nature.jpg        # Landing hero image
│   ├── logo-scale.png         # App logo (transparent)
│   ├── feature-doc.jpg        # Document feature image
│   ├── feature-global.jpg     # Global coverage image
│   └── nature-bg.jpg          # Chat background
│
├── src/
│   ├── main.tsx               # App entry point
│   ├── App.tsx                # Root component + routing + onboarding logic
│   ├── App.css                # (empty, styles in index.css)
│   ├── index.css              # Global styles, Tailwind, CSS variables, animations
│   │
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces (Message, UserSettings, etc.)
│   │
│   ├── hooks/
│   │   └── useSettings.ts     # Persistent settings hook (localStorage)
│   │
│   ├── lib/
│   │   ├── gemini.ts          # AI streaming + document analysis
│   │   ├── demo-responses.ts  # Demo mode mock responses
│   │   └── data.ts            # Countries, languages, quick topics data
│   │
│   ├── components/
│   │   ├── Onboarding.tsx     # Country-first onboarding flow (3 steps)
│   │   ├── Sidebar.tsx        # Chat history sidebar
│   │   ├── ChatMessage.tsx    # Individual message bubble
│   │   ├── LegalResponseCard.tsx  # Structured AI response sections
│   │   ├── DocumentUpload.tsx     # Document upload modal
│   │   ├── VoiceInput.tsx         # Voice recording overlay
│   │   └── SettingsPanel.tsx      # Settings modal
│   │
│   └── sections/
│       ├── LandingPage.tsx    # Marketing page (hero, features, testimonials)
│       └── ChatPage.tsx       # Core chat interface
│
├── index.html                 # HTML entry
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind theme + CSS variables
└── tsconfig.json              # TypeScript configuration
```

---

## 3. Data Flow

```
User Input (text/voice/document)
    |
    v
ChatPage.tsx → handles user input
    |
    v
streamLegalResponse() in gemini.ts
    |
    +-- Demo Mode? → demo-responses.ts → mock data
    |
    +-- Real API? → Google Gemini API → streaming response
    |
    v
parseStructuredResponse() → breaks into sections
    |
    v
LegalResponseCard.tsx → renders structured cards
    |
    v
User sees: Summary, Dos, Donts, Outcomes, Rights, Laws, Cases
```

---

## 4. Design System

### Colors (CSS Variables in index.css)
| Token | Hex | Usage |
|-------|-----|-------|
| --sage-500 | #7d8d64 | Primary buttons, accents |
| --sage-400 | #9ba882 | Hover states, icons |
| --sage-100 | #e8ebe0 | Light backgrounds |
| --cream-100 | #f9f6ef | Page background |
| --cream-200 | #f3ede2 | Card backgrounds |
| --terra-500 | #b89a78 | Warnings, accent |
| --forest-900 | #1f2419 | Dark text, sidebar |

### Typography
| Purpose | Font | Weight |
|---------|------|--------|
| Headlines | Playfair Display (serif) | 600 |
| Body | Inter (sans-serif) | 400 |

### Components
| Element | Style |
|---------|-------|
| Primary Button | `btn-sage` — rounded-full, sage green bg |
| Ghost Button | `btn-ghost-sage` — rounded-full, outlined |
| Cards | `card-glass` — frosted glass, blur(16px) |
| Inputs | `input-sage` — rounded-2xl, subtle border |
| Glass Panels | `glass` / `glass-strong` — backdrop-filter blur |

---

## 5. Onboarding Flow

```
Step 1: Country Selection
    - Searchable dropdown of 20+ countries
    - Auto-sets language based on country
    
Step 2: Language Selection  
    - Shows languages available for selected country
    - Defaults to English
    
Step 3: Interest Selection
    - Multi-select: My Rights / Laws & Articles / Solutions / Outcomes
    - Tailors AI responses to user preferences
    
→ Settings saved to localStorage
→ User never sees onboarding again (unless reset)
```

---

## 6. Adding a New Feature

### Example: Add "Emergency Rights" Quick Actions

**1. Add data in `src/lib/data.ts`:**

```typescript
export const EMERGENCY_ACTIONS = [
  { id: 'pulled-over', title: 'Pulled over by police', rights: ['Right to remain silent', 'Right to refuse search'] },
  { id: 'eviction', title: 'Being evicted', rights: ['Right to proper notice', 'Right to a hearing'] },
  { id: 'arrested', title: 'Being arrested', rights: ['Right to a lawyer', 'Right to remain silent'] },
];
```

**2. Create component `src/components/EmergencyPanel.tsx`**

**3. Add to ChatPage welcome screen:**

```tsx
// In ChatPage.tsx, add emergency quick actions alongside QUICK_TOPICS
```

### Example: Add Legal API Integration

**1. Create `src/lib/legal-apis.ts`:**

```typescript
export async function searchCaseLaw(query: string, country: string) {
  const apis: Record<string, string> = {
    US: 'https://www.courtlistener.com/api/rest/v3/',
    IN: 'https://api.indiankanoon.org/',
    GB: 'https://www.legislation.gov.uk/all/data.feed',
  };
  // Implementation here
}
```

**2. Call from `gemini.ts` before generating response:**

```typescript
// In streamLegalResponse, fetch relevant cases first
const relevantCases = await searchCaseLaw(userQuery, settings.country);
// Include in system prompt as context
```

---

## 7. Vercel Deployment

### Step 1: Add `vercel.json`

Create `vercel.json` in project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "max-age=31536000, immutable" }]
    }
  ]
}
```

### Step 2: Environment Variables (Optional)

In Vercel dashboard → Project Settings → Environment Variables:

```
GEMINI_API_KEY=your_key_here    # Optional - users can add their own
```

### Step 3: Build Settings

```
Build Command: npm run build
Output Directory: dist
Framework Preset: Vite
```

### Step 4: Deploy

```bash
# Option 1: Vercel CLI
npm i -g vercel
vercel --prod

# Option 2: GitHub Integration
# Push to GitHub, connect repo in Vercel dashboard
```

---

## 8. Customizing the AI Behavior

### Edit System Prompt

**File:** `src/lib/gemini.ts` → `buildSystemPrompt()`

The system prompt controls:
- Tone (friendly, formal, brief, detailed)
- Response structure (which sections to include)
- Country awareness
- Interest filtering

### Edit Response Sections

**File:** `src/lib/gemini.ts` → `parseStructuredResponse()`

To add a new section:
1. Add marker in system prompt (e.g., `---RESOURCES---`)
2. Add parser function
3. Add to `StructuredLegalResponse` type
4. Add to `LegalResponseCard.tsx` UI

### Make Responses Longer/Shorter

**File:** `src/lib/gemini.ts`

```typescript
generationConfig: {
  maxOutputTokens: 1500,  // ← Increase for longer, decrease for shorter
  temperature: 0.7,        // ← Higher = more creative, Lower = more focused
}
```

---

## 9. Adding Backend (Optional)

Currently all AI calls happen in the browser. For production:

### Create `api/chat.ts` (Vercel Serverless)

```typescript
// api/chat.ts
export default async function handler(req, res) {
  const { messages, country, interests } = req.body;
  
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=' + process.env.GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: messages,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1500 },
    }),
  });
  
  // Stream response back to client
  res.setHeader('Content-Type', 'text/event-stream');
  response.body?.pipe(res);
}
```

### Benefits of Backend:
- Hide API keys from users
- Rate limiting
- Chat history persistence
- Multi-user support
- Legal API proxy (bypass CORS)

---

## 10. Testing Checklist

| Test | Expected Result |
|------|----------------|
| Open app first time | Shows onboarding (country → language → interests) |
| Select country + interests | Completes onboarding, goes to landing |
| Refresh after onboarding | Skips onboarding, shows landing |
| Chat without API key | Demo mode responses appear |
| Add Gemini API key | Real AI responses (streaming) |
| Upload document | Document analysis modal opens |
| Voice input | Speech recognition activates |
| Toggle settings | Settings persist in localStorage |
| Reset settings | Back to onboarding |
| Mobile view | Responsive layout works |

---

## Quick Reference: Key Files

| Task | File |
|------|------|
| Change AI model | `src/lib/gemini.ts` |
| Change colors | `src/index.css` (CSS variables) |
| Change fonts | `src/index.css` (Google Fonts import) |
| Add countries | `src/lib/data.ts` |
| Edit onboarding | `src/components/Onboarding.tsx` |
| Edit chat UI | `src/sections/ChatPage.tsx` |
| Edit response cards | `src/components/LegalResponseCard.tsx` |
| Edit landing page | `src/sections/LandingPage.tsx` |
| Add API keys UI | `src/components/SettingsPanel.tsx` |
| Deploy to Vercel | Add `vercel.json`, push to GitHub |
