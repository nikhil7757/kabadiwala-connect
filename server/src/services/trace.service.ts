import { Prisma, PrismaClient } from '@prisma/client';
import {
  TraceEventType,
  computeTraceHash,
  verifyTraceChain,
  GENESIS_PREV_HASH,
  TraceRecordItem,
} from '@kabadiwala/shared';
import { nowIsoString } from '../lib/time.js';
import { sha256Hex } from '../lib/crypto.js';

export class TraceService {
  /**
   * Appends an immutable, tamper-evident trace event inside a transaction client
   * Enforces sequence monotonicity and row locking
   */
  static async appendTraceRecord(
    tx: Prisma.TransactionClient,
    lotId: string,
    eventType: TraceEventType,
    payload: any
  ): Promise<void> {
    // 1. Fetch latest sequence and hash with descending order
    const latest = await tx.traceRecord.findFirst({
      where: { lotId },
      orderBy: { seq: 'desc' },
      select: { seq: true, hash: true },
    });

    const nextSeq = latest ? latest.seq + 1 : 1;
    const prevHash = latest ? latest.hash : GENESIS_PREV_HASH;
    const createdAt = new Date();
    const createdAtIso = createdAt.toISOString();

    // 2. Compute canonical SHA-256 hash using crypto helper
    const hash = computeTraceHash(
      prevHash,
      lotId,
      nextSeq,
      eventType,
      payload,
      createdAtIso,
      sha256Hex
    );

    // 3. Insert record
    await tx.traceRecord.create({
      data: {
        lotId,
        seq: nextSeq,
        eventType,
        payload,
        prevHash,
        hash,
        createdAt,
      },
    });
  }

  /**
   * Verifies the full hash chain for a lot from seq 1 to the end
   */
  static async verifyLotTrace(
    prismaClient: PrismaClient | Prisma.TransactionClient,
    lotId: string
  ): Promise<{ valid: boolean; firstMismatchSeq: number | null; totalBlocks: number }> {
    const records = await prismaClient.traceRecord.findMany({
      where: { lotId },
      orderBy: { seq: 'asc' },
    });

    const items: TraceRecordItem[] = records.map((r) => ({
      lotId: r.lotId,
      seq: r.seq,
      eventType: r.eventType as TraceEventType,
      payload: r.payload,
      prevHash: r.prevHash,
      hash: r.hash,
      createdAt: r.createdAt,
    }));

    const result = verifyTraceChain(items, sha256Hex);

    return {
      valid: result.valid,
      firstMismatchSeq: result.firstMismatchSeq,
      totalBlocks: records.length,
    };
  }
}
