import { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import confetti from 'canvas-confetti';
import { LandingPage } from '@/sections/LandingPage';
import { ChatPage } from '@/sections/ChatPage';
import { Sidebar } from '@/components/Sidebar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Onboarding } from '@/components/Onboarding';
import { useSettings } from '@/hooks/useSettings';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, setSettings, resetSettings, completeOnboarding } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleCompleteOnboarding = useCallback((country: string, language: string, interests: string[]) => {
    completeOnboarding(country, language, interests);
    toast.success("You're all set!", {
      description: 'Your Legal Buddy is ready to help.',
      duration: 3000,
    });
    // Small confetti
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#8B9A7B', '#A8B89A', '#C4A882', '#F3EDE2'],
    });
  }, [completeOnboarding]);

  const handleStartChat = useCallback(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8B9A7B', '#A8B89A', '#C4A882', '#F3EDE2'],
    });
    navigate('/chat');
    toast.success('Welcome to RightSpeak!', {
      description: 'Your Legal Buddy is ready.',
      duration: 3000,
    });
  }, [navigate]);

  const handleNewChat = useCallback(() => {
    toast.info('New conversation started');
    window.location.reload();
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Show onboarding if not completed
  if (!settings.hasCompletedOnboarding) {
    return (
      <Onboarding onComplete={handleCompleteOnboarding} />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LandingPage onStartChat={handleStartChat} />
              </motion.div>
            }
          />
          <Route
            path="/chat"
            element={
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <SignedIn>
                  <div className="flex h-full">
                    <Sidebar
                      isOpen={sidebarOpen}
                      onToggle={handleToggleSidebar}
                      onNewChat={handleNewChat}
                      onOpenSettings={() => setSettingsOpen(true)}
                    />
                    <main
                      className="flex-1 h-full transition-all duration-300"
                      style={{ marginLeft: sidebarOpen ? '280px' : '0' }}
                    >
                      <ChatPage
                        onToggleSidebar={handleToggleSidebar}
                        onOpenSettings={() => setSettingsOpen(true)}
                        settings={settings}
                      />
                    </main>
                  </div>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onReset={() => {
          resetSettings();
          toast.info('Settings reset. You will go through onboarding again.');
          setTimeout(() => window.location.reload(), 1000);
        }}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e8ebe0',
            fontFamily: 'Inter, system-ui',
          },
        }}
      />
    </div>
  );
}

export default App;
