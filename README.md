# AI Law Companion

AI Law Companion, branded in the app as RightSpeak, is an AI-powered legal guidance assistant that helps people understand legal situations, documents, and rights in plain language. It is built for accessibility: simple chat, document explanation, voice input, country-specific context, and multilingual support.

> Important: This app provides general legal information, not professional legal advice. Users should consult a qualified lawyer for advice about their specific situation.

## Features

- AI legal chat with warm, plain-language responses
- Country-aware guidance for supported jurisdictions
- Structured answers with summaries, do's, don'ts, possible outcomes, rights, laws, and cases
- Document upload and explanation
- Browser voice input support
- Multilingual settings and localized country selection
- Clerk authentication integration
- Demo-mode fallback responses when the AI API is unavailable
- Vercel-ready frontend and serverless API route

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI components
- Framer Motion
- Clerk authentication
- Google Gemini API
- Express local API server
- Vercel serverless API route

## Project Structure

```text
.
|-- api/
|   `-- gemini.js              # Vercel serverless Gemini API route
|-- public/                    # Static assets
|-- src/
|   |-- components/            # App and UI components
|   |-- hooks/                 # Custom React hooks
|   |-- lib/                   # Gemini, demo data, country sources, utilities
|   |-- pages/                 # Page-level components
|   |-- sections/              # Landing and chat sections
|   `-- types/                 # TypeScript types
|-- server.cjs                 # Local Express API server
|-- vite.config.ts             # Vite config and local API proxy
|-- vercel.json                # Vercel SPA rewrite config
`-- .env.example               # Example environment variables
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- Gemini API key
- Clerk publishable key

### Installation

```bash
npm install
```

### Environment Variables

Create a local `.env` file using `.env.example` as a template:

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

Do not commit `.env` or `.env.local`. Real keys must stay local or be added directly to the deployment platform.

The repository is configured to ignore local env files:

```gitignore
.env
.env.*
!.env.example
```

### Run Locally

Run the frontend and local API server together:

```bash
npm run dev:all
```

Then open:

```text
http://localhost:3000
```

The local API server runs at:

```text
http://localhost:3001
```

You can also run them separately:

```bash
npm run dev
npm run dev:api
```

## Available Scripts

```bash
npm run dev       # Start the Vite frontend
npm run dev:api   # Start the local Express API server
npm run dev:all   # Start frontend and API together
npm run build     # Type-check and build for production
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Deployment on Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Use these build settings:

```text
Build command: npm run build
Output directory: dist
Install command: npm install
```

4. Add environment variables in Vercel Project Settings:

```text
GEMINI_API_KEY
VITE_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

`VITE_CLERK_PUBLISHABLE_KEY` is safe to expose in the browser because it is a publishable Clerk key. Do not expose secret keys with a `VITE_` prefix.

5. Redeploy after adding environment variables.

## Security Notes

- Never commit `.env` or `.env.local`.
- Keep `GEMINI_API_KEY` server-side only.
- Keep `CLERK_SECRET_KEY` server-side only.
- Only publish placeholder values in `.env.example`.
- If a real key is accidentally committed, rotate it immediately from the provider dashboard.

## Legal Disclaimer

AI Law Companion is an informational tool. It is not a law firm, does not create an attorney-client relationship, and should not be treated as a substitute for advice from a qualified legal professional.

## License

This project is currently private/unlicensed unless a license file is added.
