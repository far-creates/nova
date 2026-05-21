import {
  getUserAttemptsFiltered,
  getUserDailySummaries,
  getUserSentenceOptions,
  getUserStats,
} from '@/packages/db/src';
import { resolveAuthenticatedUserId, type ApplicationError } from './auth';

export interface GetProfileDataInput {
  authToken?: string;
  date?: string;
  sentenceId?: string;
  search?: string;
  limit: number;
  offset: number;
}

export interface GetProfileDataResult {
  stats: Awaited<ReturnType<typeof getUserStats>>;
  dailySummaries: Awaited<ReturnType<typeof getUserDailySummaries>>;
  attempts: Awaited<ReturnType<typeof getUserAttemptsFiltered>>['attempts'];
  attemptsTotal: number;
  sentenceOptions: Awaited<ReturnType<typeof getUserSentenceOptions>>;
}

export async function getProfileData(
  input: GetProfileDataInput
): Promise<{ ok: true; data: GetProfileDataResult } | { ok: false; error: ApplicationError }> {
  const authResult = await resolveAuthenticatedUserId({ token: input.authToken });
  if (!authResult.ok) {
    return { ok: false, error: authResult.error };
  }

  const [stats, dailySummaries, attemptsResult, sentenceOptions] = await Promise.all([
    getUserStats(authResult.userId),
    getUserDailySummaries(authResult.userId),
    getUserAttemptsFiltered(authResult.userId, {
      date: input.date,
      sentenceId: input.sentenceId,
      search: input.search,
      limit: input.limit,
      offset: input.offset,
    }),
    getUserSentenceOptions(authResult.userId),
  ]);

  return {
    ok: true,
    data: {
      stats,
      dailySummaries,
      attempts: attemptsResult.attempts,
      attemptsTotal: attemptsResult.total,
      sentenceOptions,
    },
  };
}
