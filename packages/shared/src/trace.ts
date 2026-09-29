import { TraceEventType } from './constants.js';

export const GENESIS_PREV_HASH = '0'.repeat(64);

export interface TraceRecordItem {
  id?: string;
  lotId: string;
  seq: number;
  eventType: TraceEventType;
  payload: any;
  prevHash: string;
  hash: string;
  createdAt: string | Date;
}

/**
 * Pure JavaScript SHA-256 implementation (zero external browser/Node dependencies)
 */
export function pureSha256Hex(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  // Encode UTF-8
  const utf8: number[] = [];
  for (i = 0; i < ascii.length; i++) {
    let charcode = ascii.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    } else {
      i++;
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (ascii.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }

  for (i = 0; i < utf8.length; i++) {
    words[i >> 2] |= utf8[i] << ((3 - (i % 4)) * 8);
  }

  words[utf8.length >> 2] |= 0x80 << ((3 - (utf8.length % 4)) * 8);
  words[(((utf8.length + 8) >> 6) << 4) + 15] = utf8.length * 8;

  const w = new Array(64);

  for (i = 0; i < words.length; i += 16) {
    const a = hash[0];
    const b = hash[1];
    const c = hash[2];
    const d = hash[3];
    const e = hash[4];
    const f = hash[5];
    const g = hash[6];
    const h = hash[7];

    let currA = a, currB = b, currC = c, currD = d, currE = e, currF = f, currG = g, currH = h;

    for (j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = words[i + j] | 0;
      } else {
        const gamma0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const gamma1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + gamma0 + w[j - 7] + gamma1) | 0;
      }

      const s1 = rightRotate(currE, 6) ^ rightRotate(currE, 11) ^ rightRotate(currE, 25);
      const ch = (currE & currF) ^ (~currE & currG);
      const temp1 = (currH + s1 + ch + k[j] + w[j]) | 0;
      const s0 = rightRotate(currA, 2) ^ rightRotate(currA, 13) ^ rightRotate(currA, 22);
      const maj = (currA & currB) ^ (currA & currC) ^ (currB & currC);
      const temp2 = (s0 + maj) | 0;

      currH = currG;
      currG = currF;
      currF = currE;
      currE = (currD + temp1) | 0;
      currD = currC;
      currC = currB;
      currB = currA;
      currA = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + currA) | 0;
    hash[1] = (hash[1] + currB) | 0;
    hash[2] = (hash[2] + currC) | 0;
    hash[3] = (hash[3] + currD) | 0;
    hash[4] = (hash[4] + currE) | 0;
    hash[5] = (hash[5] + currF) | 0;
    hash[6] = (hash[6] + currG) | 0;
    hash[7] = (hash[7] + currH) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }

  return result;
}

/**
 * Deterministically serializes any JSON-compatible value with sorted object keys and no whitespace (TRD 11.5)
 */
export function canonicalJson(val: any): string {
  if (val === null || val === undefined) {
    return 'null';
  }
  if (typeof val === 'number' || typeof val === 'boolean') {
    return JSON.stringify(val);
  }
  if (typeof val === 'string') {
    return JSON.stringify(val);
  }
  if (Array.isArray(val)) {
    return '[' + val.map((item) => canonicalJson(item)).join(',') + ']';
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val).sort();
    const parts = keys.map((key) => {
      return JSON.stringify(key) + ':' + canonicalJson(val[key]);
    });
    return '{' + parts.join(',') + '}';
  }
  return JSON.stringify(val);
}

/**
 * Formulates the exact string to hash for a trace block:
 * prevHash + lotId + String(seq) + eventType + canonicalJson(payload) + createdAtIso
 */
export function computeTraceHash(
  prevHash: string,
  lotId: string,
  seq: number,
  eventType: TraceEventType,
  payload: any,
  createdAtIso: string,
  hasher: (input: string) => string = pureSha256Hex
): string {
  const contentToHash =
    prevHash + lotId + String(seq) + eventType + canonicalJson(payload) + createdAtIso;
  return hasher(contentToHash);
}

/**
 * Verifies an append-only trace chain from sequence 1 onwards
 * Returns { valid: true, firstMismatchSeq: null } if intact, or the first corrupted sequence number
 */
export function verifyTraceChain(
  records: TraceRecordItem[],
  hasher: (input: string) => string = pureSha256Hex
): { valid: boolean; firstMismatchSeq: number | null } {
  if (!records || records.length === 0) {
    return { valid: true, firstMismatchSeq: null };
  }

  // Sort by sequence ascending
  const sorted = [...records].sort((a, b) => a.seq - b.seq);

  let expectedPrevHash = GENESIS_PREV_HASH;

  for (let i = 0; i < sorted.length; i++) {
    const rec = sorted[i];
    const expectedSeq = i + 1;

    // Check sequence continuity
    if (rec.seq !== expectedSeq) {
      return { valid: false, firstMismatchSeq: rec.seq };
    }

    // Check parent link
    if (rec.prevHash !== expectedPrevHash) {
      return { valid: false, firstMismatchSeq: rec.seq };
    }

    // Recompute current hash
    const createdAtIso =
      rec.createdAt instanceof Date ? rec.createdAt.toISOString() : new Date(rec.createdAt).toISOString();

    const computed = computeTraceHash(
      rec.prevHash,
      rec.lotId,
      rec.seq,
      rec.eventType,
      rec.payload,
      createdAtIso,
      hasher
    );

    if (computed !== rec.hash) {
      return { valid: false, firstMismatchSeq: rec.seq };
    }

    expectedPrevHash = rec.hash;
  }

  return { valid: true, firstMismatchSeq: null };
}
