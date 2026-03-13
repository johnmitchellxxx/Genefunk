import React, { InputHTMLAttributes, SelectHTMLAttributes, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function CyberCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-card/80 backdrop-blur-md border border-border clip-edges p-7 relative overflow-hidden", 
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:pointer-events-none",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CyberButton({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' }) {
  const variants = {
    primary: "bg-primary/10 border-primary text-primary hover:bg-primary hover:text-primary-foreground neon-border",
    secondary: "bg-secondary/10 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground neon-border-secondary",
    destructive: "bg-destructive/10 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground border",
    ghost: "bg-transparent border-transparent text-muted-foreground hover:text-primary hover:bg-primary/5 border",
  };

  return (
    <button 
      className={cn(
        "px-6 py-2 font-mono tracking-widest uppercase text-sm font-bold transition-all duration-300 clip-edges relative overflow-hidden group",
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{props.children}</span>
    </button>
  );
}

export function CyberInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={cn(
        "w-full bg-background/50 border-b-2 border-border focus:border-primary px-3 py-2 text-foreground font-mono outline-none transition-colors",
        "placeholder:text-muted-foreground/50",
        className
      )}
      {...props}
    />
  );
}

export function EditableField({ 
  value, 
  onSave, 
  type = "text",
  className,
  label 
}: { 
  value: string | number, 
  onSave: (val: string | number) => void,
  type?: "text" | "number",
  className?: string,
  label?: string
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onSave(type === 'number' ? Number(localValue) || 0 : localValue);
    }
  };

  if (isEditing) {
    return (
      <CyberInput
        autoFocus
        type={type}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        className={className}
      />
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-pointer group relative px-2 py-1 -mx-2 -my-1 rounded hover:bg-primary/10 transition-colors",
        className
      )}
    >
      {label && <span className="text-sm text-muted-foreground block mb-1 uppercase tracking-widest">{label}</span>}
      <span className={cn("block truncate", !localValue && "text-muted-foreground italic")}>
        {localValue || "Empty..."}
      </span>
      <div className="absolute inset-0 border border-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity clip-edges" />
    </div>
  );
}

export function CyberSelect({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full bg-background/50 border-b-2 border-border focus:border-primary px-3 py-2 text-foreground font-mono outline-none transition-colors appearance-none cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

const CUSTOM_VALUE = "__CUSTOM__";

export function EditableSelect({
  value,
  onSave,
  options,
  className,
  label,
  placeholder,
}: {
  value: string;
  onSave: (val: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  label?: string;
  placeholder?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const switchingToCustomRef = useRef(false);

  const isKnownOption = options.some(o => o.value === value);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === CUSTOM_VALUE) {
      switchingToCustomRef.current = true;
      setIsCustom(true);
      setCustomValue(value || '');
      return;
    }
    setIsEditing(false);
    setIsCustom(false);
    if (selected !== value) {
      onSave(selected);
    }
  };

  const handleSelectBlur = () => {
    if (switchingToCustomRef.current) {
      switchingToCustomRef.current = false;
      return;
    }
    setIsEditing(false);
    setIsCustom(false);
  };

  const handleCustomBlur = () => {
    setIsEditing(false);
    setIsCustom(false);
    if (customValue !== value) {
      onSave(customValue);
    }
  };

  if (isEditing && isCustom) {
    return (
      <CyberInput
        autoFocus
        value={customValue}
        onChange={e => setCustomValue(e.target.value)}
        onBlur={handleCustomBlur}
        onKeyDown={e => e.key === 'Enter' && handleCustomBlur()}
        placeholder={placeholder || 'Enter custom value...'}
        className={className}
      />
    );
  }

  if (isEditing) {
    return (
      <CyberSelect
        autoFocus
        value={isKnownOption ? value : CUSTOM_VALUE}
        onChange={handleSelectChange}
        onBlur={handleSelectBlur}
        className={className}
      >
        <option value="">— Select —</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
        <option value={CUSTOM_VALUE}>✎ Custom...</option>
      </CyberSelect>
    );
  }

  return (
    <div
      onClick={() => { setIsEditing(true); setIsCustom(false); }}
      className={cn(
        "cursor-pointer group relative px-2 py-1 -mx-2 -my-1 rounded hover:bg-primary/10 transition-colors",
        className
      )}
    >
      {label && <span className="text-sm text-muted-foreground block mb-1 uppercase tracking-widest">{label}</span>}
      <span className={cn("block truncate", !value && "text-muted-foreground italic")}>
        {value || placeholder || "Empty..."}
      </span>
      <div className="absolute inset-0 border border-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity clip-edges" />
    </div>
  );
}

export function CyberBadge({ children, className, variant = 'primary' }: { children: React.ReactNode, className?: string, variant?: 'primary' | 'secondary' | 'destructive' | 'outline' }) {
  const variants = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "bg-transparent border border-primary text-primary"
  };
  
  return (
    <span className={cn("px-2.5 py-1 text-xs font-bold uppercase tracking-wider clip-edges", variants[variant], className)}>
      {children}
    </span>
  );
}

export function SectionHeader({ title, children }: { title: string, children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5 border-b border-border/50 pb-3">
      <h3 className="text-2xl font-bold text-primary tracking-widest uppercase">{title}</h3>
      {children}
    </div>
  );
}
