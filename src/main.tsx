import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <main style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: '#f7f3ea',
        color: '#203328',
      }}>
        <section style={{
          maxWidth: '560px',
          border: '1px solid #ded8c8',
          borderRadius: '12px',
          padding: '28px',
          background: '#fffaf0',
          boxShadow: '0 12px 40px rgba(32, 51, 40, 0.08)',
        }}>
          <h1 style={{ margin: '0 0 12px', fontSize: '24px' }}>Missing Clerk configuration</h1>
          <p style={{ margin: '0 0 16px', lineHeight: 1.6 }}>
            Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> in Vercel Environment Variables, then redeploy.
          </p>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#637260' }}>
            Use the publishable key from Clerk. Do not use the Clerk secret key here.
          </p>
        </section>
      </main>
    </StrictMode>,
  )
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        signInFallbackRedirectUrl="/chat"
        signUpFallbackRedirectUrl="/chat"
        afterSignOutUrl="/"
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </StrictMode>,
  )
}
