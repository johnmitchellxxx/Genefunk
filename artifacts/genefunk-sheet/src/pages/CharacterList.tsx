import React, { useState, useRef } from 'react';
import { useAppCharacters, useAppCreateCharacter, useAppUpdateCharacter, useAppAuth } from '@/hooks/use-api';
import { Link, useLocation } from 'wouter';
import { CyberCard, CyberButton } from '@/components/CyberUI';
import { Plus, User, Activity, Calendar, Shield, FileEdit, X } from 'lucide-react';
import { format } from 'date-fns';
import { CharacterWizard } from '@/components/CharacterWizard';

export default function CharacterList() {
  const { data: auth } = useAppAuth();
  const isAdmin = auth?.user?.id === 'john';
  const { data: characters, isLoading } = useAppCharacters();
  const createMutation = useAppCreateCharacter();
  const updateMutation = useAppUpdateCharacter();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [blankOpen, setBlankOpen] = useState(false);
  const [blankName, setBlankName] = useState('');
  const blankInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  const [wizardError, setWizardError] = useState<string | null>(null);

  const handleBlankCreate = () => {
    const name = blankName.trim();
    if (!name) return;
    createMutation.mutate(
      { data: { name } },
      {
        onSuccess: (created: { id: number }) => {
          setBlankOpen(false);
          setBlankName('');
          setLocation(`/characters/${created.id}`);
        },
        onError: () => {
          setWizardError('Failed to create character. Please try again.');
        },
      }
    );
  };

  const handleWizardComplete = (data: Record<string, unknown>) => {
    const { name, ...rest } = data;
    setWizardError(null);
    createMutation.mutate(
      { data: { name: name as string } },
      {
        onSuccess: (created: { id: number }) => {
          updateMutation.mutate(
            { id: created.id, data: rest },
            {
              onSuccess: () => {
                setWizardOpen(false);
                setLocation(`/characters/${created.id}`);
              },
              onError: () => {
                setWizardError('Failed to apply character data. The character was created but may need manual editing.');
                setWizardOpen(false);
                setLocation(`/characters/${created.id}`);
              },
            }
          );
        },
        onError: () => {
          setWizardError('Failed to create character. Please try again.');
        },
      }
    );
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-primary"><Activity className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen p-8 bg-background scanlines">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex justify-between items-center mb-12 border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-widest uppercase">Operative Roster</h1>
            {isAdmin ? (
              <p className="text-yellow-400 font-mono mt-2 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Admin view — all operatives across all users
              </p>
            ) : (
              <p className="text-primary font-mono mt-2">Active database connection established.</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setBlankOpen(true); setTimeout(() => blankInputRef.current?.focus(), 50); }}
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-mono uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-all clip-edges"
            >
              <FileEdit className="w-4 h-4" /> Blank Sheet
            </button>
            <CyberButton onClick={() => setWizardOpen(true)} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Constructing..." : <><Plus className="inline mr-2 w-4 h-4"/> New Operative</>}
            </CyberButton>
          </div>
        </div>

        {wizardError && (
          <div className="mb-6 p-4 border border-destructive bg-destructive/10 text-destructive text-sm font-mono clip-edges">
            {wizardError}
            <button onClick={() => setWizardError(null)} className="ml-4 underline hover:text-destructive/80">Dismiss</button>
          </div>
        )}

        {(!characters || characters.length === 0) ? (
          <div className="text-center py-24 text-muted-foreground border border-dashed border-border clip-edges bg-background/50">
            <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-mono">No operatives found in database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(char => (
              <Link key={char.id} href={`/characters/${char.id}`} className="block group">
                <CyberCard className="h-full hover:border-primary cursor-pointer transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{char.name}</h2>
                      <p className="text-muted-foreground text-sm font-mono mt-1">Level {char.level} {char.class || 'Unknown Class'}</p>
                      {(char as { userId?: string }).userId && (
                        <p className="text-muted-foreground/60 text-xs font-mono mt-1">
                          by {(char as { userId?: string }).userId}
                        </p>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/50 group-hover:bg-primary/20">
                      <User className="text-primary" />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center text-xs text-muted-foreground font-mono">
                    <Calendar className="w-3 h-3 mr-2" />
                    Last Updated: {format(new Date(char.updatedAt), 'MMM d, yyyy')}
                  </div>
                </CyberCard>
              </Link>
            ))}
          </div>
        )}
      </div>

      {wizardOpen && (
        <CharacterWizard
          onClose={() => setWizardOpen(false)}
          onComplete={handleWizardComplete}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {blankOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-border clip-edges p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-mono uppercase tracking-widest text-foreground">Blank Sheet</h2>
              <button onClick={() => { setBlankOpen(false); setBlankName(''); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Enter your operative's name. All other fields will be blank for manual entry.</p>
            <input
              ref={blankInputRef}
              type="text"
              value={blankName}
              onChange={e => setBlankName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBlankCreate()}
              placeholder="Operative name..."
              maxLength={50}
              className="w-full bg-background border border-border px-3 py-2 font-mono text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary clip-edges mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setBlankOpen(false); setBlankName(''); }}
                className="flex-1 px-4 py-2 font-mono text-sm uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground transition-all clip-edges"
              >
                Cancel
              </button>
              <CyberButton
                onClick={handleBlankCreate}
                disabled={!blankName.trim() || createMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </CyberButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
