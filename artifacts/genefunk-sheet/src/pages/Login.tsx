import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { CyberButton, CyberCard } from '@/components/CyberUI';
import { Loader2, Fingerprint, User, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

type KnownUser = { userId: string; characterCount: number };

export default function Login() {
  const [knownUsers, setKnownUsers] = useState<KnownUser[]>([]);
  const [loadingUser, setLoadingUser] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const newInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.ok ? r.json() : [])
      .then((users: KnownUser[]) => setKnownUsers(users))
      .catch(() => {});
  }, []);

  const loginAs = async (name: string) => {
    setLoadingUser(name);
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
        setError((data as { error?: string }).error || 'Login failed.');
        return;
      }
      await queryClient.invalidateQueries();
      setLocation('/characters');
    } catch {
      setError('Could not connect. Try again.');
    } finally {
      setLoadingUser(null);
    }
  };

  const handleNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    loginAs(name);
  };

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
        className="relative z-10 w-full max-w-lg p-4"
      >
        <div className="flex flex-col items-center mb-8">
          <Fingerprint className="w-16 h-16 text-primary mb-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
          <h1 className="text-4xl font-bold tracking-widest text-foreground">GENEFUNK</h1>
          <h2 className="text-lg text-primary tracking-[0.3em] mt-1 font-mono">OPERATIVE_DB</h2>
        </div>

        {error && (
          <p className="text-destructive text-sm font-mono text-center mb-4">{error}</p>
        )}

        {/* Operative tiles */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {knownUsers.map((u, i) => (
            <motion.button
              key={u.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => loginAs(u.userId)}
              disabled={loadingUser !== null}
              className="relative flex flex-col items-center justify-center gap-2 p-6 bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 clip-edges group disabled:opacity-50"
            >
              {loadingUser === u.userId ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary transition-all">
                  <User className="w-6 h-6 text-primary" />
                </div>
              )}
              <span className="font-mono text-sm tracking-wider text-foreground group-hover:text-primary transition-colors uppercase">
                {u.userId}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/60">
                {u.characterCount} operative{u.characterCount !== 1 ? 's' : ''}
              </span>
            </motion.button>
          ))}

          {/* New Operative tile */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: knownUsers.length * 0.07 }}
            onClick={() => { setShowNewForm(true); setTimeout(() => newInputRef.current?.focus(), 50); }}
            disabled={loadingUser !== null}
            className="flex flex-col items-center justify-center gap-2 p-6 bg-card border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 clip-edges group disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-full bg-muted/30 border border-border flex items-center justify-center group-hover:border-primary/50 transition-all">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="font-mono text-sm tracking-wider text-muted-foreground group-hover:text-primary transition-colors uppercase">
              New Operative
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/40">
              first time?
            </span>
          </motion.button>
        </div>

        {/* New name form */}
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <CyberCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">New Operative Name</span>
                <button onClick={() => { setShowNewForm(false); setNewName(''); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleNewSubmit} className="flex gap-2">
                <input
                  ref={newInputRef}
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Enter name..."
                  maxLength={50}
                  className="flex-1 bg-background border border-primary/40 text-foreground font-mono text-sm px-3 py-2 focus:outline-none focus:border-primary placeholder:text-muted-foreground/40 clip-edges"
                />
                <CyberButton type="submit" disabled={!newName.trim() || loadingUser !== null}>
                  {loadingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join'}
                </CyberButton>
              </form>
            </CyberCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
