import React from 'react';

export const Badge = ({
  children,
  variant = 'info',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const normalizedVariant = (variant || 'info').toLowerCase();

  const variants = {
    critical: "bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]",
    high: "bg-amber-950/90 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
    medium: "bg-yellow-950/80 text-yellow-300 border-yellow-500/40",
    low: "bg-cyan-950/90 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]",
    info: "bg-slate-900/90 text-slate-300 border-slate-700/80",
    success: "bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
    running: "bg-blue-950/90 text-blue-300 border-blue-500/50 animate-pulse",
    purple: "bg-purple-950/90 text-purple-300 border-purple-500/50",
    cyan: "bg-cyan-950/90 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]",
    warning: "bg-amber-950/90 text-amber-300 border-amber-500/50",
    ghost: "bg-slate-800/80 text-slate-400 border-slate-700/60",
    passed: "bg-emerald-950/90 text-emerald-300 border-emerald-500/50",
    failed: "bg-rose-950/90 text-rose-300 border-rose-500/50",
  };

  const dots = {
    critical: "bg-rose-400 shadow-[0_0_8px_#f43f5e]",
    high: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
    medium: "bg-yellow-400",
    low: "bg-cyan-400 shadow-[0_0_8px_#00f3ff]",
    info: "bg-slate-400",
    success: "bg-emerald-400 shadow-[0_0_8px_#10b981]",
    running: "bg-blue-400 animate-ping",
    purple: "bg-purple-400",
    cyan: "bg-cyan-400 shadow-[0_0_8px_#00f3ff]",
    warning: "bg-amber-400",
    ghost: "bg-slate-400",
    passed: "bg-emerald-400",
    failed: "bg-rose-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wide rounded-md",
    lg: "px-3.5 py-1.5 text-sm font-semibold rounded-lg"
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-mono select-none ${
        variants[normalizedVariant] || variants.info
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dots[normalizedVariant] || 'bg-slate-400'}`} />
      )}
      <span>{children}</span>
    </span>
  );
};
