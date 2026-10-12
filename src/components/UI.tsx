import { ReactNode } from 'react';
import { cn } from '../utils/cn';

// ---------- Tombol ----------
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed select-none';
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variants = {
    primary:
      'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/20',
    secondary:
      'bg-slate-700/80 text-slate-100 hover:bg-slate-600/80 border border-slate-600',
    ghost:
      'bg-transparent text-slate-300 hover:bg-slate-700/50 border border-slate-700',
    danger:
      'bg-rose-600/80 text-white hover:bg-rose-500/80 border border-rose-500',
    success:
      'bg-emerald-600/80 text-white hover:bg-emerald-500/80 border border-emerald-500',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </button>
  );
}

// ---------- Panel ----------
export function Panel({
  children,
  className = '',
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-sm p-4 shadow-xl',
        className
      )}
    >
      {title && (
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-cyan-300">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

// ---------- Badge ----------
export function Badge({
  children,
  tone = 'cyan',
}: {
  children: ReactNode;
  tone?: 'cyan' | 'amber' | 'emerald' | 'rose' | 'slate';
}) {
  const tones = {
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    slate: 'bg-slate-600/30 text-slate-300 border-slate-600/50',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

// ---------- Slider ----------
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  accent = 'cyan',
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  label?: string;
  accent?: 'cyan' | 'amber' | 'emerald';
}) {
  const accents = {
    cyan: 'accent-cyan-400',
    amber: 'accent-amber-400',
    emerald: 'accent-emerald-400',
  };
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300">{label}</span>
          <span className="font-mono text-cyan-300">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn('w-full h-2 rounded-lg cursor-pointer', accents[accent])}
        aria-label={label}
      />
    </div>
  );
}

// ---------- Toggle ----------
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300 select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-cyan-500' : 'bg-slate-600'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          )}
        />
      </button>
      <span>{label}</span>
    </label>
  );
}
