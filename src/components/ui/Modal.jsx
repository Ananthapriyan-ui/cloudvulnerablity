import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-2xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark backdrop blur overlay */}
      <div
        className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full ${maxWidth} bg-[#0b1324] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.15)] overflow-hidden z-10 animate-fade-in-up my-auto`}>
        {/* Top subtle cyan accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500" />
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 tracking-tight">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-slate-400 font-normal">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 text-sm text-slate-200 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer Actions */}
        {footer !== undefined ? (
          footer && (
            <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-end gap-3">
              {footer}
            </div>
          )
        ) : (
          <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-end">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
