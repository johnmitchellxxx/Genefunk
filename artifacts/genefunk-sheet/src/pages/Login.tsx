import React, { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { CyberButton, CyberCard } from '@/components/CyberUI';
import { Loader2, Fingerprint, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Enter your operative name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || 'Login failed. Try again.');
        return;
      }

      await queryClient.invalidateQueries();
      setLocation('/characters');
    } catch {
      setError('Could not connect. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [name, queryClient, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden scanlines">
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
            Enter your operative name to access your character dossier.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="OPERATIVE NAME"
                maxLength={50}
                autoFocus
                className="w-full bg-background border border-primary/40 text-foreground font-mono text-sm tracking-widest pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm font-mono">{error}</p>
            )}

            <CyberButton
              type="submit"
              disabled={loading}
              className="w-full text-lg py-4 flex items-center justify-center gap-3"
            >
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <Fingerprint className="w-5 h-5" />
              }
              {loading ? 'AUTHENTICATING...' : 'INITIALIZE NEURAL LINK'}
            </CyberButton>
          </form>
        </CyberCard>
      </motion.div>
    </div>
  );
}
