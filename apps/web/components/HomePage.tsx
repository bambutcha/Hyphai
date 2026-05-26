'use client';

import { useEffect, useState } from 'react';
import { AuthScreen } from '@/components/AuthScreen';
import { ChatApp } from '@/components/ChatApp';
import { LandingPage } from '@/components/LandingPage';
import { getAuthToken } from '@/lib/api';

export function HomePage() {
  const [authed, setAuthed] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(!!getAuthToken());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-dvh bg-[var(--hyphai-bg-deep)]" />;
  }

  if (authed) {
    return <ChatApp />;
  }

  if (showAuth) {
    return (
      <AuthScreen
        onAuthenticated={() => {
          setAuthed(true);
          setShowAuth(false);
        }}
      />
    );
  }

  return <LandingPage onLogin={() => setShowAuth(true)} />;
}
