import React from 'react';

// ── Radar & Cyber Spinner ──────────────────────────────────────────
export const Loader = ({ size = 'md', text = 'ANALYZING THREAT VECTORS...', fullScreen = false }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4 p-6" role="status" aria-live="polite">
      <div className={`relative flex items-center justify-center ${sizes[size] || sizes.md}`}>
        {/* Concentric Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" />
        <div className="absolute -inset-1.5 rounded-full border border-cyan-500/10" />
        
        {/* Rotating Radar Sweep Line */}
        <div className="w-full h-full rounded-full border-2 border-slate-800 border-t-cyan-400 border-r-cyan-400/40 animate-spin shadow-[0_0_20px_rgba(0,243,255,0.4)]" />
        
        {/* Glowing Center Core */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f3ff] animate-pulse" />
      </div>
      
      {text && (
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs font-mono tracking-widest text-cyan-400 font-semibold uppercase animate-pulse">
            {text}
          </p>
          <span className="text-[10px] font-mono text-slate-500">SecOps Engine v2.0 • Active</span>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030712]/95 backdrop-blur-xl flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }
  return loaderContent;
};

// ── Skeleton elements ──────────────────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-lg bg-slate-800/60 border border-slate-700/20 ${className}`}
  />
);

export const SkeletonCard = ({ rows = 3 }) => (
  <div className="p-6 space-y-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
    <Skeleton className="h-5 w-36" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className={`h-4 ${i % 2 === 0 ? 'w-full' : 'w-4/5'}`} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div className="space-y-3 p-4">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 items-center">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className={`h-4 flex-1 ${c === 0 ? 'w-32' : ''}`} />
        ))}
      </div>
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-36" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  </div>
);
