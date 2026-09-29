import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, CheckCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { StickyActionBar } from '../../components/common/StickyActionBar.js';
import { db, OutboxItem } from '../../db/index.js';
import { useAppStore } from '../../store/useAppStore.js';
import { syncClient } from '../../lib/sync.js';

export const SyncScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isOnline, syncing } = useAppStore();
  const [actions, setActions] = useState<OutboxItem[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const loadOutbox = async () => {
    const list = await db.outbox.orderBy('createdAt').toArray();
    setActions(list);

    const syncItem = await db.meta.get('lastSyncAt');
    setLastSync(syncItem?.value || null);
  };

  useEffect(() => {
    loadOutbox();
  }, [syncing]);

  const handleSyncNow = async () => {
    await syncClient.triggerSync();
    await loadOutbox();
  };

  const handleDismiss = async (actionId: string) => {
    await db.outbox.delete(actionId);
    await loadOutbox();
  };

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-28">
      <TopBar title="Sync Center" />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col gap-4">
        {/* Status Card */}
        <div className="p-4 rounded-xs border-2 border-kc-border-strong bg-kc-surface flex items-center justify-between shadow-[2px_2px_0px_#141414]">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isOnline ? 'bg-kc-success-soft text-kc-success' : 'bg-kc-accent-soft text-kc-accent'
              }`}
            >
              <RefreshCw className={`w-6 h-6 ${syncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-kc-ink">
                {isOnline ? 'Connected (Online)' : 'No Connection (Offline)'}
              </h2>
              <p className="text-xs text-kc-ink-dim font-mono">
                Last Synced: {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never'}
              </p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-full ${
              actions.length === 0
                ? 'bg-kc-success-soft text-kc-success'
                : 'bg-kc-warn-soft text-kc-warn'
            }`}
          >
            {actions.length === 0 ? 'SYNCED' : `${actions.length} PENDING`}
          </span>
        </div>

        {/* Action List */}
        <div>
          <h3 className="text-sm font-bold text-kc-ink uppercase tracking-wider mb-2">
            Pending Actions Queue
          </h3>

          {actions.length === 0 ? (
            <div className="p-8 text-center rounded-xs border border-kc-border bg-kc-surface-2">
              <CheckCircle className="w-10 h-10 text-kc-success mx-auto mb-2" />
              <p className="text-base font-bold text-kc-ink">All changes are synced!</p>
              <p className="text-xs text-kc-ink-dim mt-1">
                Your device has no pending actions waiting for the server.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {actions.map((act) => (
                <div
                  key={act.actionId}
                  className={`p-3 rounded-xs border bg-kc-surface flex items-start justify-between ${
                    act.status === 'REJECTED'
                      ? 'border-kc-danger bg-kc-danger-soft/20'
                      : 'border-kc-border'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {act.status === 'REJECTED' ? (
                      <AlertTriangle className="w-5 h-5 text-kc-danger shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-5 h-5 text-kc-warn shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-kc-ink uppercase">
                          {act.type}
                        </span>
                        <span className="text-[10px] font-mono text-kc-ink-dim">
                          {new Date(act.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      {act.errorMessage && (
                        <p className="text-xs font-bold text-kc-danger mt-1">
                          {act.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  {act.status === 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => handleDismiss(act.actionId)}
                      className="text-xs font-bold text-kc-ink-dim hover:text-kc-danger underline ml-2"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <StickyActionBar
        primaryLabel={syncing ? 'Syncing...' : 'Sync Now'}
        primaryOnClick={handleSyncNow}
        primaryDisabled={syncing || !isOnline}
        primaryLoading={syncing}
      />
    </div>
  );
};
