import { compareTexts } from '@/lib/compareTexts';
import { createAttempt, getSentenceById, getSentenceByTrackId } from '@/packages/db/src';
import { resolveAuthenticatedUserId, type ApplicationError } from './auth';

export interface SubmitAttemptInput {
  sentenceId?: string;
  audioTrackId?: string;
  userText: string;
  saveAttempt: boolean;
  authToken?: string;
}

export interface SubmitAttemptResult {
  sentenceId: string;
  audioTrackId: string | null;
  userText: string;
  correct: number[];
  wrong: Array<{ index: number; expected: string; got: string }>;
  extra: Array<{ index: number; char: string }>;
  accuracy: number;
}

export async function submitAttempt(
  input: SubmitAttemptInput
): Promise<{ ok: true; data: SubmitAttemptResult } | { ok: false; error: ApplicationError }> {
  let resolvedUserId: string | null = null;

  if (input.saveAttempt) {
    const authResult = await resolveAuthenticatedUserId({ token: input.authToken });
    if (!authResult.ok) {
      return { ok: false, error: authResult.error };
    }
    resolvedUserId = authResult.userId;
  }

  const sentence = input.audioTrackId
    ? await getSentenceByTrackId(input.audioTrackId)
    : await getSentenceById(input.sentenceId!);

  if (!sentence) {
    return {
      ok: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: 'Sentence not found for the selected track',
      },
    };
  }

  const correction = compareTexts(sentence.text, input.userText);

  if (input.saveAttempt && resolvedUserId) {
    await createAttempt(sentence.id, resolvedUserId, input.userText);
  }

  return {
    ok: true,
    data: {
      sentenceId: sentence.id,
      audioTrackId: input.audioTrackId ?? null,
      userText: input.userText,
      ...correction,
    },
  };
}
