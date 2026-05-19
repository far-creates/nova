import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  legacyProfileQueryInputSchema,
  legacyProfileResponseSchema,
} from '@/packages/api/src/profile';
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

    const parsedQuery = legacyProfileQueryInputSchema.safeParse({
      date: request.nextUrl.searchParams.get('date') || undefined,
      sentenceId: request.nextUrl.searchParams.get('sentenceId') || undefined,
      search: request.nextUrl.searchParams.get('search') || undefined,
      limit: request.nextUrl.searchParams.get('limit') || '20',
      offset: request.nextUrl.searchParams.get('offset') || '0',
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        {
          error: 'Invalid profile query',
          details: parsedQuery.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { date, sentenceId, search, limit, offset } = parsedQuery.data;

    const [stats, dailySummaries, attemptsResult, sentenceOptions] = await Promise.all([
      getUserStats(decoded.userId),
      getUserDailySummaries(decoded.userId),
      getUserAttemptsFiltered(decoded.userId, {
        date,
        sentenceId,
        search,
        limit,
        offset,
      }),
      getUserSentenceOptions(decoded.userId),
    ]);

    const responsePayload = {
      stats,
      dailySummaries,
      attempts: attemptsResult.attempts,
      attemptsTotal: attemptsResult.total,
      sentenceOptions,
    };

    const parsedResponse = legacyProfileResponseSchema.safeParse(responsePayload);
    if (!parsedResponse.success) {
      console.error('Invalid profile response payload:', parsedResponse.error.flatten());
      return NextResponse.json(
        { error: 'Failed to fetch profile data' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResponse.data);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}
