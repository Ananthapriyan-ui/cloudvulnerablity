import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, X } from 'lucide-react';

export const Alert = ({
  title,
  children,
  type = 'info',
  onClose,
  className = ''
}) => {
  const types = {
    info: {
      bg: "bg-cyan-950/40 border-cyan-500/30 text-cyan-200",
      icon: Info,
      iconColor: "text-cyan-400"
    },
    success: {
      bg: "bg-emerald-950/40 border-emerald-500/30 text-emerald-200",
      icon: ShieldCheck,
      iconColor: "text-emerald-400"
    },
    warning: {
      bg: "bg-amber-950/40 border-amber-500/30 text-amber-200",
      icon: AlertTriangle,
      iconColor: "text-amber-400"
    },
    error: {
      bg: "bg-rose-950/40 border-rose-500/30 text-rose-200",
      icon: ShieldAlert,
      iconColor: "text-rose-400"
    }
  };

  const currentType = types[type] || types.info;
  const IconComponent = currentType.icon;

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md flex items-start gap-3 transition-all ${currentType.bg} ${className}`}>
      <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${currentType.iconColor}`} />
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold text-slate-100 mb-1">{title}</h4>}
        <div className="text-slate-300 text-xs sm:text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
