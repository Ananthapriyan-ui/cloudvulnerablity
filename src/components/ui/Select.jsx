import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold tracking-wider text-slate-300 uppercase">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full bg-[#0d1424] text-slate-100 text-sm rounded-lg border appearance-none
            ${error ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'} 
            ${Icon ? 'pl-9' : 'pl-3.5'} 
            pr-10 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer ${className}`}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
