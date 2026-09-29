import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type LotStatusKey =
  | 'LOCAL_DRAFT'
  | 'DRAFT'
  | 'LISTED'
  | 'QUOTED'
  | 'ACCEPTED'
  | 'HANDED_OVER'
  | 'CONFIRMED'
  | 'PAID'
  | 'CANCELLED';

interface StatusChipProps {
  status: LotStatusKey;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, className = '' }) => {
  const { t } = useTranslation();

  const config: Record<
    LotStatusKey,
    { labelKey: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    LOCAL_DRAFT: {
      labelKey: 'status_saved',
      icon: <FileText className="w-3.5 h-3.5" />,
      bg: 'var(--kc-surface-2)',
      text: 'var(--kc-ink)',
      border: 'var(--kc-border-strong)',
    },
    DRAFT: {
      labelKey: 'status_saved',
      icon: <FileText className="w-3.5 h-3.5" />,
      bg: 'var(--kc-surface-2)',
      text: 'var(--kc-ink)',
      border: 'var(--kc-border-strong)',
    },
    LISTED: {
      labelKey: 'status_waiting',
      icon: <Clock className="w-3.5 h-3.5 animate-spin" />,
      bg: 'var(--kc-warn-soft)',
      text: 'var(--kc-warn)',
      border: 'var(--kc-warn)',
    },
    QUOTED: {
      labelKey: 'status_quote',
      icon: <DollarSign className="w-3.5 h-3.5" />,
      bg: 'var(--kc-accent-soft)',
      text: 'var(--kc-accent-text)',
      border: 'var(--kc-accent)',
    },
    ACCEPTED: {
      labelKey: 'status_ready',
      icon: <ArrowRight className="w-3.5 h-3.5" />,
      bg: 'var(--kc-accent-soft)',
      text: 'var(--kc-accent-text)',
      border: 'var(--kc-accent)',
    },
    HANDED_OVER: {
      labelKey: 'status_ready',
      icon: <Clock className="w-3.5 h-3.5" />,
      bg: 'var(--kc-accent-soft)',
      text: 'var(--kc-accent-text)',
      border: 'var(--kc-accent)',
    },
    CONFIRMED: {
      labelKey: 'status_confirmed',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      bg: 'var(--kc-success-soft)',
      text: 'var(--kc-success)',
      border: 'var(--kc-success)',
    },
    PAID: {
      labelKey: 'status_paid',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      bg: 'var(--kc-success-soft)',
      text: 'var(--kc-success)',
      border: 'var(--kc-success)',
    },
    CANCELLED: {
      labelKey: 'status_cancelled',
      icon: <XCircle className="w-3.5 h-3.5" />,
      bg: 'var(--kc-danger-soft)',
      text: 'var(--kc-danger)',
      border: 'var(--kc-danger)',
    },
  };

  const item = config[status] || config.DRAFT;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${className}`}
      style={{
        backgroundColor: item.bg,
        color: item.text,
        borderColor: item.border,
      }}
    >
      {item.icon}
      <span>{t(item.labelKey)}</span>
    </span>
  );
};
