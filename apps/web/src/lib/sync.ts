import { db, OutboxItem } from '../db/index.js';
import { useAppStore } from '../store/useAppStore.js';

class SyncClient {
  private syncInProgress = false;
  private timer: any = null;

  init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      useAppStore.getState().setOnline(true);
      this.triggerSync();
    });

    window.addEventListener('offline', () => {
      useAppStore.getState().setOnline(false);
    });

    // 60-second periodic sync loop
    this.timer = setInterval(() => {
      if (navigator.onLine && !this.syncInProgress) {
        this.triggerSync();
      }
    }, 60000);

    // Initial check
    setTimeout(() => this.triggerSync(), 2000);
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async queueAction(
    type: OutboxItem['type'],
    payload: any
  ): Promise<string> {
    const actionId = crypto.randomUUID();
    await db.outbox.add({
      actionId,
      type,
      createdAt: new Date().toISOString(),
      payload,
      status: 'PENDING',
    });

    const count = await db.outbox.count();
    useAppStore.getState().setPendingCount(count);

    // If online, kick off sync immediately
    if (navigator.onLine) {
      this.triggerSync().catch(console.error);
    }

    return actionId;
  }

  async triggerSync(): Promise<{ success: boolean; error?: string }> {
    if (this.syncInProgress) return { success: false, error: 'Sync already in progress' };

    const state = useAppStore.getState();
    const token = state.token;
    if (!token || state.role !== 'COLLECTOR') {
      return { success: false, error: 'Unauthenticated or not collector' };
    }

    this.syncInProgress = true;
    state.setSyncing(true);

    try {
      // 1. Fetch pending outbox actions
      const actions = await db.outbox.orderBy('createdAt').toArray();
      const lastSyncItem = await db.meta.get('lastSyncAt');
      const since = lastSyncItem?.value || null;

      const payload = {
        deviceId: state.deviceId || 'browser-client',
        since,
        actions: actions.map((a) => ({
          actionId: a.actionId,
          type: a.type,
          createdAt: a.createdAt,
          payload: a.payload,
        })),
      };

      const res = await fetch('/api/v1/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        // Token expired
        await state.logout();
        return { success: false, error: 'Session expired' };
      }

      if (!res.ok) {
        throw new Error(`Sync request failed with status ${res.status}`);
      }

      const body = await res.json();
      const syncData = body.data;

      // 2. Process action results
      if (syncData.results) {
        for (const resItem of syncData.results) {
          if (resItem.status === 'APPLIED' || resItem.status === 'DUPLICATE') {
            await db.outbox.delete(resItem.actionId);

            // If a serverLotId and refCode were returned, update corresponding local lot
            if (resItem.serverLotId) {
              const matchedAction = actions.find((a) => a.actionId === resItem.actionId);
              const lotClientId =
                matchedAction?.payload?.clientId || matchedAction?.payload?.lotClientId;
              if (lotClientId) {
                await db.lots.update(lotClientId, {
                  serverId: resItem.serverLotId,
                  refCode: resItem.refCode,
                });
              }
            }
          } else if (resItem.status === 'REJECTED') {
            await db.outbox.update(resItem.actionId, {
              status: 'REJECTED',
              errorMessage: resItem.error?.message || 'Server rejected action',
            });
          }
        }
      }

      // 3. Apply server updates into local Dexie tables
      if (syncData.updates) {
        const u = syncData.updates;
        if (u.materials?.length) {
          await db.materials.bulkPut(u.materials);
        }
        if (u.prices?.length) {
          await db.prices.bulkPut(u.prices);
        }
        if (u.recyclers?.length) {
          await db.recyclers.bulkPut(u.recyclers);
        }
        if (u.safety?.length) {
          await db.safety.bulkPut(u.safety);
        }
        if (u.ledger?.length) {
          await db.ledger.bulkPut(u.ledger);
        }

        // Merge lots
        if (u.lots?.length) {
          for (const serverLot of u.lots) {
            const local = await db.lots.get(serverLot.clientId);
            if (local) {
              await db.lots.put({
                ...local,
                serverId: serverLot.id,
                refCode: serverLot.refCode,
                status: serverLot.status,
                quotedPrice: serverLot.quotedPrice,
                finalPrice: serverLot.finalPrice,
                anomalyFlag: serverLot.anomalyFlag,
                anomalyReason: serverLot.anomalyReason,
                handover: serverLot.handover,
                updatedAt: serverLot.updatedAt,
              });
            } else {
              await db.lots.put({
                clientId: serverLot.clientId,
                serverId: serverLot.id,
                refCode: serverLot.refCode,
                categoryId: serverLot.categoryId,
                subCategoryCode: serverLot.subCategoryCode,
                description: serverLot.description,
                condition: serverLot.condition,
                sourceType: serverLot.sourceType,
                approxWeightKg: serverLot.approxWeightKg,
                estimatedValue: serverLot.estimatedValue,
                collectedAt: serverLot.collectedAt,
                status: serverLot.status,
                selectedRecyclerId: serverLot.selectedRecyclerId,
                pickupRequested: serverLot.pickupRequested,
                quotedPrice: serverLot.quotedPrice,
                finalPrice: serverLot.finalPrice,
                anomalyFlag: serverLot.anomalyFlag,
                anomalyReason: serverLot.anomalyReason,
                handover: serverLot.handover,
                updatedAt: serverLot.updatedAt,
              });
            }
          }
        }
      }

      // 4. Update lastSyncAt and outbox count
      if (syncData.serverTime) {
        await db.meta.put({ key: 'lastSyncAt', value: syncData.serverTime });
      }

      const pendingRemaining = await db.outbox.count();
      state.setPendingCount(pendingRemaining);

      return { success: true };
    } catch (err: any) {
      console.warn('Sync failed, will retry automatically:', err.message);
      return { success: false, error: err.message };
    } finally {
      this.syncInProgress = false;
      state.setSyncing(false);
    }
  }
}

export const syncClient = new SyncClient();
