import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:   'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-semibold border border-cyan-300/40 shadow-[0_0_20px_rgba(0,243,255,0.35)] hover:shadow-[0_0_28px_rgba(0,243,255,0.6)] focus:ring-cyan-400',
  secondary: 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 hover:text-cyan-300 focus:ring-slate-500',
  outline:   'bg-transparent text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] focus:ring-cyan-400',
  danger:    'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-medium border border-rose-400/30 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] focus:ring-rose-500',
  ghost:     'bg-transparent hover:bg-slate-800/70 text-slate-300 hover:text-white focus:ring-slate-500',
  success:   'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.3)] focus:ring-emerald-500',
  warning:   'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-semibold border border-amber-300/30 focus:ring-amber-400',
};

const SIZES = {
  xs:   'px-2.5 py-1 text-[11px] gap-1 rounded-md',
  sm:   'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md:   'px-4.5 py-2.5 text-sm gap-2 rounded-lg',
  lg:   'px-6 py-3 text-base gap-2.5 rounded-xl',
  icon: 'p-2 text-sm rounded-lg',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  onClick,
  type = 'button',
  title,
  id,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-200 ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#030712] ' +
    'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 ' +
    'select-none whitespace-nowrap tracking-tight';

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      title={title}
      aria-busy={isLoading}
      aria-label={title || (typeof children === 'string' ? children : undefined)}
      className={`${base} ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children && <span>{children}</span>}
      {!isLoading && IconRight && <IconRight className="w-4 h-4 shrink-0 ml-0.5" />}
    </button>
  );
};
