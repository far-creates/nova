import { normalizeForScoring } from './accuracy';

export interface CorrectionResult {
    correct: number[]; // indices of correct characters
    wrong: Array<{ index: number; expected: string; got: string }>;
    extra: Array<{ index: number; char: string }>;
    accuracy: number; // percentage
  }
   
  export function compareTexts(reference: string, userInput: string): CorrectionResult {
    const ref = normalizeForScoring(reference);
    const user = normalizeForScoring(userInput);
   
    const correct: number[] = [];
    const wrong: Array<{ index: number; expected: string; got: string }> = [];
    const extra: Array<{ index: number; char: string }> = [];
   
    // Compare each character
    for (let i = 0; i < Math.max(ref.length, user.length); i++) {
      const refChar = ref[i];
      const userChar = user[i];
   
      if (userChar === undefined) {
        // User didn't finish typing
        break;
      }
   
      if (refChar === undefined) {
        // User typed extra characters
        extra.push({ index: i, char: userChar });
      } else if (refChar === userChar) {
        correct.push(i);
      } else {
        wrong.push({ index: i, expected: refChar, got: userChar });
      }
    }
   
    const accuracy = ref.length > 0 ? Math.round((correct.length / ref.length) * 100) : 0;
   
    return { correct, wrong, extra, accuracy };
  }
  
