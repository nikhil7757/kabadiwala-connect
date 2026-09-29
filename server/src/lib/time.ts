export function nowUtc(): Date {
  return new Date();
}

export function nowIsoString(): string {
  return new Date().toISOString();
}
