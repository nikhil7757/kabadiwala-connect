import React from 'react';
export default function Badge({ children, className = '' }: any) {
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 ${className}`}>
      {children}
    </span>
  );
}