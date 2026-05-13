export function normalizeForScoring(value: string): string {
  return value
    .trim()
    .replace(/\.+$/, '')
    .trimEnd()
    .toLowerCase();
}

export function calculateAccuracy(original: string, typed: string): number {
  const normalizedOriginal = normalizeForScoring(original);
  const normalizedTyped = normalizeForScoring(typed);

  if (!normalizedOriginal || normalizedOriginal.length === 0) return 0;

  let correctChars = 0;
  const minLength = Math.min(normalizedOriginal.length, normalizedTyped.length);

  for (let i = 0; i < minLength; i++) {
    if (normalizedOriginal[i] === normalizedTyped[i]) {
      correctChars++;
    }
  }

  const accuracy = (correctChars / normalizedOriginal.length) * 100;
  return Math.round(accuracy * 100) / 100;
}
