import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IndianRupee, Wallet, Clock, CheckCircle2, Package, ArrowUpRight } from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { NotchCard } from '../../components/common/NotchCard.js';
import { StatusChip } from '../../components/common/StatusChip.js';
import { db, LedgerItem } from '../../db/index.js';

export const EarningsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<LedgerItem[]>([]);
  const [totals, setTotals] = useState({ earned: '0.00', pending: '0.00' });

  useEffect(() => {
    const loadLedger = async () => {
      const items = await db.ledger.orderBy('paidAt').reverse().toArray();
      setEntries(items);

      let earnedNum = 0;
      let pendingNum = 0;
      for (const i of items) {
        earnedNum += parseFloat(i.amountPaid || '0');
        pendingNum += parseFloat(i.dueAmount || '0');
      }

      setTotals({
        earned: earnedNum.toFixed(2),
        pending: pendingNum.toFixed(2),
      });
    };

    loadLedger();
  }, []);

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-12">
      <TopBar title={t('home_earnings')} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-4">
        {/* Two Summary NotchCards */}
        <div className="grid grid-cols-2 gap-3">
          <NotchCard className="shadow-[3px_3px_0px_#141414]">
            <div className="flex items-center gap-2 mb-1 text-kc-success">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-mono font-bold uppercase">{t('received')}</span>
            </div>
            <p className="text-2xl font-black font-mono text-kc-ink">
              ₹{totals.earned}
            </p>
            <span className="text-[10px] font-mono text-kc-ink-dim block mt-1">
              PAID TO COLLECTOR
            </span>
          </NotchCard>

          <NotchCard className="shadow-[3px_3px_0px_#141414]">
            <div className="flex items-center gap-2 mb-1 text-kc-warn">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-mono font-bold uppercase">{t('pending')}</span>
            </div>
            <p className="text-2xl font-black font-mono text-kc-accent">
              ₹{totals.pending}
            </p>
            <span className="text-[10px] font-mono text-kc-ink-dim block mt-1">
              DUE FROM BUYERS
            </span>
          </NotchCard>
        </div>

        {/* Ledger Entries List */}
        <div>
          <h2 className="text-sm font-bold text-kc-ink uppercase tracking-wider mb-2">
            Payment Records
          </h2>

          {entries.length === 0 ? (
            <div className="p-8 text-center rounded-xs border-2 border-dashed border-kc-border bg-kc-surface mt-2">
              <Wallet className="w-12 h-12 text-kc-ink-dim mx-auto mb-3" />
              <p className="text-base font-bold text-kc-ink mb-1">No earnings records yet</p>
              <p className="text-xs text-kc-ink-dim">
                Payments recorded during scrap handovers will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-xs border-2 border-kc-border-strong bg-kc-surface shadow-[2px_2px_0px_#141414] flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xs bg-kc-surface-2 border border-kc-border flex items-center justify-center text-kc-accent font-bold">
                      {entry.mode === 'UPI' ? 'UPI' : 'CASH'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono font-bold text-kc-ink">
                          {entry.lotRefCode || 'KC-LOT'}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full ${
                            entry.status === 'PAID'
                              ? 'bg-kc-success-soft text-kc-success'
                              : 'bg-kc-warn-soft text-kc-warn'
                          }`}
                        >
                          {entry.status}
                        </span>
                      </div>
                      <p className="text-xs text-kc-ink-dim font-medium">
                        {entry.recyclerName || 'Authorized Recycler'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-mono font-bold text-kc-ink">
                      ₹{entry.amountPaid}
                    </p>
                    {parseFloat(entry.dueAmount) > 0 && (
                      <span className="text-[10px] font-mono text-kc-warn block font-bold">
                        ₹{entry.dueAmount} due
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
