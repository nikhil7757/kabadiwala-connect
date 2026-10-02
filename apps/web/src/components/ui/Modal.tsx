import React from 'react';
export default function Modal({ children, open, onClose }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-xl relative w-full max-w-md">
        <button className="absolute top-2 right-2" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}