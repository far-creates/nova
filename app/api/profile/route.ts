import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  getUserAttemptsFiltered,
  getUserDailySummaries,
  getUserSentenceOptions,
  getUserStats,
} from '@/lib/attempts';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const params = request.nextUrl.searchParams;
    const date = params.get('date') || undefined;
    const sentenceId = params.get('sentenceId') || undefined;
    const search = params.get('search') || undefined;
    const limit = Number(params.get('limit') || '20');
    const offset = Number(params.get('offset') || '0');

    const [stats, dailySummaries, attemptsResult, sentenceOptions] = await Promise.all([
      getUserStats(decoded.userId),
      getUserDailySummaries(decoded.userId),
      getUserAttemptsFiltered(decoded.userId, {
        date,
        sentenceId,
        search,
        limit: Number.isNaN(limit) ? 20 : limit,
        offset: Number.isNaN(offset) ? 0 : offset,
      }),
      getUserSentenceOptions(decoded.userId),
    ]);

    return NextResponse.json({
      stats,
      dailySummaries,
      attempts: attemptsResult.attempts,
      attemptsTotal: attemptsResult.total,
      sentenceOptions,
    });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}
