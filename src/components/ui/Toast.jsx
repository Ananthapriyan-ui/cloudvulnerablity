import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Info, X, ShieldAlert } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  info:    Info,
  success: ShieldCheck,
  warning: AlertTriangle,
  error:   ShieldAlert,
};

const STYLES = {
  info:    { border: 'border-cyan-500/50',    icon: 'text-cyan-400',    bg: 'from-cyan-500/10',    bar: 'bg-cyan-400' },
  success: { border: 'border-emerald-500/50', icon: 'text-emerald-400', bg: 'from-emerald-500/10', bar: 'bg-emerald-400' },
  warning: { border: 'border-amber-500/50',   icon: 'text-amber-400',   bg: 'from-amber-500/10',   bar: 'bg-amber-400' },
  error:   { border: 'border-rose-500/50',    icon: 'text-rose-400',    bg: 'from-rose-500/10',    bar: 'bg-rose-400' },
};

// ── Single Toast item ──────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);
  const style = STYLES[toast.type] || STYLES.info;
  const Icon = ICONS[toast.type] || Info;
  const duration = toast.duration || 4000;

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 10);

    // Progress bar countdown
    const step = 50;
    const decrement = (step / duration) * 100;
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p - decrement;
        if (next <= 0) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return next;
      });
    }, step);

    // Auto remove
    const removeTimer = setTimeout(() => handleClose(), duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(removeTimer);
      clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`
        relative overflow-hidden flex items-start gap-3 p-4
        bg-linear-to-r ${style.bg} to-transparent
        bg-[#0d1424]/95 border ${style.border}
        rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md
        transform transition-all duration-300 ease-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
        pointer-events-auto
      `}
    >
      {/* Icon */}
      <div className={`shrink-0 mt-0.5 ${style.icon}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-xs font-bold text-slate-100 mb-0.5">{toast.title}</p>
        )}
        <p className="text-xs text-slate-200 leading-relaxed wrap-break-word">{toast.message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="shrink-0 text-slate-500 hover:text-white p-1 rounded-md transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800">
        <div
          className={`h-full ${style.bar} transition-all ease-linear`}
          style={{ width: `${progress}%`, transitionDuration: '50ms' }}
        />
      </div>
    </div>
  );
};

// ── Toast Provider ─────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const duration = typeof options === 'number' ? options : (options.duration ?? 4000);
    const title = typeof options === 'object' ? options.title : undefined;

    setToasts((prev) => {
      // Deduplicate identical messages
      if (prev.some((t) => t.message === message && t.type === type)) return prev;
      // Max 5 toasts at once
      const trimmed = prev.length >= 5 ? prev.slice(1) : prev;
      return [...trimmed, { id, message, type, duration, title }];
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-9999 flex flex-col gap-2.5 w-80 max-w-[calc(100vw-2rem)] pointer-events-none"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
