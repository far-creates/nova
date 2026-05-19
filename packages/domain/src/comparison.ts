import { calculateAccuracy } from './scoring';
import { normalizeForScoring } from './normalization';
import type { CorrectionResult } from './types';

export function compareTexts(reference: string, userInput: string): CorrectionResult {
  const normalizedReference = normalizeForScoring(reference);
  const normalizedInput = normalizeForScoring(userInput);

  const correct: number[] = [];
  const wrong: Array<{ index: number; expected: string; got: string }> = [];
  const extra: Array<{ index: number; char: string }> = [];

  for (let index = 0; index < Math.max(normalizedReference.length, normalizedInput.length); index++) {
    const expected = normalizedReference[index];
    const got = normalizedInput[index];

    if (got === undefined) {
      break;
    }

    if (expected === undefined) {
      extra.push({ index, char: got });
    } else if (expected === got) {
      correct.push(index);
    } else {
      wrong.push({ index, expected, got });
    }
  }

  return {
    correct,
    wrong,
    extra,
    accuracy: calculateAccuracy(reference, userInput),
  };
}
