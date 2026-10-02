import React from 'react';
export default function Button({ children, className = '', ...props }: any) {
  return (
    <button className={`bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition ${className}`} {...props}>
      {children}
    </button>
  );
}