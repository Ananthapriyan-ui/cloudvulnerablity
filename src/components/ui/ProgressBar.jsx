import React from 'react';

export const ProgressBar = ({
  progress = 0,
  statusLabel,
  showPercentage = true,
  variant = 'cyan',
  className = ''
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const variants = {
    cyan: "bg-cyan-400 shadow-[0_0_12px_rgba(0,243,255,0.6)]",
    green: "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]",
    amber: "bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]",
    rose: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(statusLabel || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 truncate">{statusLabel || 'Progress'}</span>
          {showPercentage && (
            <span className="text-cyan-400 font-bold">{clampedProgress}%</span>
          )}
        </div>
      )}
      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full ${variants[variant] || variants.cyan}`}
          style={{ width: `${clampedProgress}%` }}
        />
        {clampedProgress > 0 && clampedProgress < 100 && (
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-scan-line" />
        )}
      </div>
    </div>
  );
};
