import React from 'react';
import { useAppStore } from '../../store/useAppStore.js';
import { useTranslation } from 'react-i18next';

export const ConnectivityDot: React.FC<{ showLabel?: boolean }> = ({ showLabel = true }) => {
  const isOnline = useAppStore((s) => s.isOnline);
  const { t } = useTranslation();

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border"
      style={{
        backgroundColor: isOnline ? 'var(--kc-success-soft)' : 'var(--kc-accent-soft)',
        borderColor: isOnline ? 'var(--kc-success)' : 'var(--kc-accent)',
        color: isOnline ? 'var(--kc-success)' : 'var(--kc-accent-text)',
      }}
      role="status"
      aria-label={isOnline ? 'Online' : 'Offline'}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-kc-success' : 'bg-kc-accent animate-pulse'
        }`}
      />
      {showLabel && (
        <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
      )}
    </div>
  );
};
