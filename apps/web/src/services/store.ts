export const getItem = <T>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || '') ?? fallback; } catch { return fallback; }
};
export const setItem = <T>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));