import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useAppAuth } from '@/hooks/use-api';
import { useLocation } from 'wouter';
import { CyberButton, CyberCard } from '@/components/CyberUI';
import { Loader2, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const AUTH_POLL_INTERVAL_MS = 2000;
const AUTH_POLL_MAX_DURATION_MS = 5 * 60 * 1000;

export default function Login() {
  const { data: auth, isLoading, refetch } = useAppAuth();
  const [, setLocation] = useLocation();
  const [popupBlocked, setPopupBlocked] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollStartRef = useRef<number>(0);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (auth?.isAuthenticated) {
      stopPolling();
      setLocation('/characters');
    }
  }, [auth, setLocation, stopPolling]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const startPolling = useCallback(() => {
    stopPolling();
    pollStartRef.current = Date.now();
    pollRef.current = setInterval(() => {
      if (Date.now() - pollStartRef.current > AUTH_POLL_MAX_DURATION_MS) {
        stopPolling();
        return;
      }
      refetch();
    }, AUTH_POLL_INTERVAL_MS);
  }, [refetch, stopPolling]);

  const handleLogin = useCallback(() => {
    const returnTo = encodeURIComponent(window.location.pathname);
    const authUrl = `/api/login?returnTo=${returnTo}`;
    const popup = window.open(authUrl, '_blank', 'noopener,noreferrer');

    if (!popup) {
      setPopupBlocked(true);
      return;
    }

    setPopupBlocked(false);
    startPolling();
  }, [startPolling]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden scanlines">
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/cyber-bg.png)` }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-4"
      >
        <CyberCard className="flex flex-col items-center text-center p-12">
          <Fingerprint className="w-20 h-20 text-primary mb-6 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
          
          <h1 className="text-4xl font-bold mb-2 tracking-widest text-foreground">GENEFUNK</h1>
          <h2 className="text-xl text-primary tracking-[0.3em] mb-8 font-mono">OPERATIVE_DB</h2>
          
          <p className="text-muted-foreground mb-8 text-sm max-w-xs">
            Unauthorized access is strictly prohibited. Identify yourself to access your character dossier.
          </p>

          <CyberButton 
            className="w-full text-lg py-4 flex items-center justify-center gap-3"
            onClick={handleLogin}
          >
            <Fingerprint className="w-5 h-5" />
            INITIALIZE NEURAL LINK
          </CyberButton>

          {popupBlocked && (
            <p className="text-destructive mt-4 text-sm">
              Pop-up blocked. Please allow pop-ups for this site, or{' '}
              <a
                href={`/api/login?returnTo=${encodeURIComponent(window.location.pathname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
                onClick={startPolling}
              >
                click here to log in
              </a>.
            </p>
          )}
        </CyberCard>
      </motion.div>
    </div>
  );
}
