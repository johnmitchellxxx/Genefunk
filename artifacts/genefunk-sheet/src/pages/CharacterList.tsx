import React, { useState, useRef } from 'react';
import { useAppCharacters, useAppCreateCharacter, useAppUpdateCharacter, useAppDeleteCharacter, useAppAuth, useAppTrashedCharacters, useAppRestoreCharacter, useAppPermanentlyDeleteCharacter, useAppBackupNow } from '@/hooks/use-api';
import { Link, useLocation } from 'wouter';
import { CyberCard, CyberButton } from '@/components/CyberUI';
import { Plus, User, Activity, Calendar, Shield, FileEdit, X, Trash2, RotateCcw, AlertTriangle, Inbox, Download } from 'lucide-react';
import { format } from 'date-fns';
import { CharacterWizard } from '@/components/CharacterWizard';

export default function CharacterList() {
  const { data: auth } = useAppAuth();
  const isAdmin = auth?.user?.id === 'john';
  const { data: characters, isLoading } = useAppCharacters();
  const { data: trashed, isLoading: trashLoading } = useAppTrashedCharacters();
  const createMutation = useAppCreateCharacter();
  const updateMutation = useAppUpdateCharacter();
  const deleteMutation = useAppDeleteCharacter();
  const restoreMutation = useAppRestoreCharacter();
  const permDeleteMutation = useAppPermanentlyDeleteCharacter();
  const backupMutation = useAppBackupNow();
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [blankOpen, setBlankOpen] = useState(false);
  const [blankName, setBlankName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmPermDeleteId, setConfirmPermDeleteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'roster' | 'trash'>('roster');
  const blankInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmDeleteId === id) {
      deleteMutation.mutate({ id });
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  const handleRestore = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    restoreMutation.mutate({ id });
  };

  const handlePermDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmPermDeleteId === id) {
      permDeleteMutation.mutate({ id });
      setConfirmPermDeleteId(null);
    } else {
      setConfirmPermDeleteId(id);
    }
  };

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

  const trashedCount = trashed?.length ?? 0;

  return (
    <div className="min-h-screen p-8 bg-transparent scanlines" onClick={() => { setConfirmDeleteId(null); setConfirmPermDeleteId(null); }}>
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-widest uppercase">Operative Roster</h1>
            <p className="text-primary font-mono mt-2">
              {isAdmin ? <><Shield className="inline w-4 h-4 mr-2 text-yellow-400" /><span className="text-yellow-400">Admin</span> — </> : null}
              All operatives visible. You can only edit or delete your own.
            </p>
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

        {isAdmin && (
          <div className="flex gap-1 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-5 py-2 font-mono text-sm uppercase tracking-wider transition-all border-b-2 -mb-px ${
                activeTab === 'roster'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Roster
            </button>
            <button
              onClick={() => setActiveTab('trash')}
              className={`px-5 py-2 font-mono text-sm uppercase tracking-wider transition-all border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === 'trash'
                  ? 'border-destructive text-destructive'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Trash
              {trashedCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === 'trash' ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                  {trashedCount}
                </span>
              )}
            </button>
          </div>
        )}

        {wizardError && (
          <div className="mb-6 p-4 border border-destructive bg-destructive/10 text-destructive text-sm font-mono clip-edges">
            {wizardError}
            <button onClick={() => setWizardError(null)} className="ml-4 underline hover:text-destructive/80">Dismiss</button>
          </div>
        )}

        {activeTab === 'roster' && (
          <>
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
                      
                      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-2" />
                          {format(new Date(char.updatedAt), 'MMM d, yyyy')}
                        </span>
                        {(isAdmin || (char as { userId?: string }).userId === auth?.user?.id) && (
                          <button
                            onClick={(e) => handleDelete(e, char.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                              confirmDeleteId === char.id
                                ? 'text-destructive border border-destructive bg-destructive/10 animate-pulse'
                                : 'text-muted-foreground/50 hover:text-destructive'
                            }`}
                            title={confirmDeleteId === char.id ? 'Click again to move to trash' : 'Move to trash'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {confirmDeleteId === char.id && <span className="text-[10px] uppercase tracking-wider">Move to trash?</span>}
                          </button>
                        )}
                      </div>
                    </CyberCard>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'trash' && isAdmin && (
          <>
            <div className="flex items-start gap-3 mb-4 p-3 border border-yellow-500/30 bg-yellow-500/5 clip-edges">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-yellow-400/80 text-xs font-mono">
                  Trashed operatives are hidden from all users. Restore to make them accessible again, or permanently delete to erase all data. Permanent deletion cannot be undone.
                </p>
                <p className="text-yellow-400/60 text-xs font-mono mt-1">
                  Weekly snapshots run automatically every Sunday at midnight — dated copies land here so you can roll back to any week.
                </p>
              </div>
              <button
                onClick={() => {
                  setBackupMessage(null);
                  backupMutation.mutate(undefined, {
                    onSuccess: (data: { created: number; skipped: number }) => {
                      setBackupMessage(
                        data.created > 0
                          ? `Snapshot saved — ${data.created} operative${data.created !== 1 ? 's' : ''} backed up.`
                          : `All operatives already have a snapshot for today.`
                      );
                    },
                    onError: (err: Error) => {
                      setBackupMessage(`Backup failed: ${err.message}`);
                    },
                  });
                }}
                disabled={backupMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-primary/50 text-primary hover:bg-primary/10 transition-all clip-edges flex-shrink-0 disabled:opacity-40"
                title="Snapshot all active operatives to trash now"
              >
                <Download className="w-3.5 h-3.5" />
                {backupMutation.isPending ? 'Saving...' : 'Backup Now'}
              </button>
            </div>

            {backupMessage && (
              <div className={`flex items-center gap-2 mb-4 px-4 py-2 text-xs font-mono clip-edges border ${backupMessage.startsWith('Backup failed') ? 'border-destructive/50 bg-destructive/10 text-destructive' : 'border-primary/30 bg-primary/5 text-primary'}`}>
                {backupMessage}
                <button onClick={() => setBackupMessage(null)} className="ml-auto text-current/50 hover:text-current"><X className="w-3 h-3" /></button>
              </div>
            )}

            {trashLoading ? (
              <div className="flex items-center justify-center py-16 text-primary"><Activity className="animate-spin" /></div>
            ) : !trashed || trashed.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground border border-dashed border-border clip-edges bg-background/50">
                <Inbox className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-mono">Trash is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trashed.map(char => (
                  <CyberCard key={char.id} className="h-full border-destructive/30 bg-destructive/5 opacity-80">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground/60 line-through">{char.name}</h2>
                        <p className="text-muted-foreground text-sm font-mono mt-1">Level {char.level} {char.class || 'Unknown Class'}</p>
                        {(char as { userId?: string }).userId && (
                          <p className="text-muted-foreground/60 text-xs font-mono mt-1">
                            by {(char as { userId?: string }).userId}
                          </p>
                        )}
                        {(char as { deletedAt?: string | null }).deletedAt && (
                          <p className="text-destructive/60 text-xs font-mono mt-1">
                            Trashed {format(new Date((char as { deletedAt: string }).deletedAt), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/30">
                        <User className="text-destructive/50" />
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => handleRestore(e, char.id)}
                        disabled={restoreMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-primary/50 text-primary hover:bg-primary/10 transition-all clip-edges disabled:opacity-40"
                        title="Restore operative"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restore
                      </button>
                      <button
                        onClick={(e) => handlePermDelete(e, char.id)}
                        disabled={permDeleteMutation.isPending}
                        className={`flex items-center gap-1 px-2 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-all clip-edges ${
                          confirmPermDeleteId === char.id
                            ? 'bg-destructive text-destructive-foreground border border-destructive animate-pulse'
                            : 'border border-destructive/40 text-destructive/60 hover:bg-destructive/10 hover:text-destructive'
                        }`}
                        title={confirmPermDeleteId === char.id ? 'Click again — this cannot be undone!' : 'Permanently delete'}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {confirmPermDeleteId === char.id ? 'Confirm erase?' : 'Erase'}
                      </button>
                    </div>
                  </CyberCard>
                ))}
              </div>
            )}
          </>
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
