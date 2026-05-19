export function normalizeForScoring(value: string): string {
  return value.trim().replace(/\.+$/, '').trimEnd().toLowerCase();
}
