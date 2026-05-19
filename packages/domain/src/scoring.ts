import { normalizeForScoring } from './normalization';

export function calculateAccuracy(original: string, typed: string): number {
  const normalizedOriginal = normalizeForScoring(original);
  const normalizedTyped = normalizeForScoring(typed);

  if (!normalizedOriginal) {
    return 0;
  }

  let correctChars = 0;
  const minLength = Math.min(normalizedOriginal.length, normalizedTyped.length);

  for (let index = 0; index < minLength; index++) {
    if (normalizedOriginal[index] === normalizedTyped[index]) {
      correctChars++;
    }
  }

  const accuracy = (correctChars / normalizedOriginal.length) * 100;
  return Math.round(accuracy * 100) / 100;
}
