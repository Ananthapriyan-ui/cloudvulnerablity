import React from 'react';

export const Table = ({ children, className = '' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/40">
      <table className={`w-full text-left text-sm text-slate-300 border-collapse ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className = '' }) => {
  return (
    <thead className={`bg-slate-900/90 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 ${className}`}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className = '' }) => {
  return (
    <tbody className={`divide-y divide-slate-800/60 ${className}`}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className = '', onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors duration-150 hover:bg-slate-800/40 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = '' }) => {
  return (
    <th className={`px-4 py-3.5 ${className}`}>
      {children}
    </th>
  );
};

export const TableCell = ({ children, className = '' }) => {
  return (
    <td className={`px-4 py-3.5 font-normal text-slate-200 ${className}`}>
      {children}
    </td>
  );
};
