import React, { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { CyberButton, CyberCard } from '@/components/CyberUI';
import { Loader2, Fingerprint, User, ChevronDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

type KnownUser = { userId: string; characterCount: number };

const NEW_OPERATIVE = '__new__';

export default function Login() {
  const [knownUsers, setKnownUsers] = useState<KnownUser[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.ok ? r.json() : [])
      .then((users: KnownUser[]) => {
        setKnownUsers(users);
        if (users.length > 0) setSelected(users[0].userId);
        else setSelected(NEW_OPERATIVE);
      })
      .catch(() => {
        setSelected(NEW_OPERATIVE);
      });
  }, []);

  const isNew = selected === NEW_OPERATIVE;

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const name = isNew ? newName.trim() : selected;
    if (!name) {
      setError(isNew ? 'Enter a name for your new operative.' : 'Select an operative.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
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
  }, [selected, newName, isNew, queryClient, setLocation]);

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

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">

            <div className="flex flex-col gap-2 text-left">
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Select Operative
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <select
                  value={selected}
                  onChange={e => { setSelected(e.target.value); setError(''); }}
                  className="w-full bg-background border border-primary/40 text-foreground font-mono text-sm tracking-wider pl-10 pr-10 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                >
                  {knownUsers.map(u => (
                    <option key={u.userId} value={u.userId}>
                      {u.userId}
                      {u.characterCount > 0 ? `  (${u.characterCount} operative${u.characterCount !== 1 ? 's' : ''})` : ''}
                    </option>
                  ))}
                  <option value={NEW_OPERATIVE}>+ New Operative</option>
                </select>
              </div>
            </div>

            {isNew && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2 text-left"
              >
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  New Operative Name
                </label>
                <div className="relative">
                  <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="ENTER NAME..."
                    maxLength={50}
                    autoFocus
                    className="w-full bg-background border border-primary/60 text-foreground font-mono text-sm tracking-widest pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                  />
                </div>
              </motion.div>
            )}

            {error && (
              <p className="text-destructive text-sm font-mono">{error}</p>
            )}

            <CyberButton
              type="submit"
              disabled={loading || (!isNew && !selected)}
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
