import React from 'react';

export const Card = ({ children, className = '', glow = false, hover = true, ...props }) => {
  return (
    <div
      className={`cyber-glass-card rounded-xl overflow-hidden transition-all duration-300 ${
        hover ? 'hover:-translate-y-0.5 hover:border-cyan-500/30' : ''
      } ${
        glow ? 'border-cyan-500/40 shadow-[0_0_25px_rgba(0,243,255,0.15)]' : 'border-slate-800/80'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', action }) => {
  return (
    <div className={`px-6 py-4 border-b border-slate-800/80 flex items-center justify-between gap-4 ${className}`}>
      <div className="min-w-0 flex-1">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardTitle = ({ children, className = '', icon: Icon, subtitle, badge }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <h3 className={`text-base font-semibold text-slate-100 tracking-tight flex items-center gap-2 ${className}`}>
          <span>{children}</span>
          {badge}
        </h3>
      </div>
      {subtitle && <p className="text-xs text-slate-400 font-normal leading-relaxed">{subtitle}</p>}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4.5 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 ${className}`}>
      {children}
    </div>
  );
};
