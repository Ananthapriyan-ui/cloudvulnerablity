import React, { useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  success,
  hint,
  helperText,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  id: externalId,
  ...props
}) => {
  const generatedId = useId();
  const id = externalId || generatedId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const borderColor = error
    ? 'border-rose-500/60 focus:border-rose-400 focus:ring-rose-500/30'
    : success
    ? 'border-emerald-500/60 focus:border-emerald-400 focus:ring-emerald-500/30'
    : 'border-slate-700/60 focus:border-cyan-500/60 focus:ring-cyan-500/20';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-300 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Left icon */}
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none z-10">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`
            w-full bg-slate-900/70 text-slate-100 text-sm
            border rounded-lg
            px-3 py-2.5
            ${Icon ? 'pl-9' : ''}
            ${isPassword || error || success ? 'pr-9' : ''}
            ${borderColor}
            focus:outline-none focus:ring-2
            placeholder:text-slate-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${inputClassName}
          `}
          {...props}
        />

        {/* Right: password toggle OR status icon */}
        <div className="absolute right-3 flex items-center">
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          {!isPassword && error && (
            <AlertCircle className="w-4 h-4 text-rose-400 pointer-events-none" />
          )}
          {!isPassword && success && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-rose-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}

      {/* Hint */}
      {!error && (hint || helperText) && (
        <p id={`${id}-hint`} className="text-[11px] text-slate-500">
          {hint || helperText}
        </p>
      )}
    </div>
  );
};
