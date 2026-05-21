import { NextRequest, NextResponse } from 'next/server';
import { getProfileData } from '@/packages/application/src/profile';
import {
  legacyProfileQueryInputSchema,
  legacyProfileResponseSchema,
} from '@/packages/api/src/profile';

export async function profileGetHandler(request: NextRequest) {
  try {
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
    const result = await getProfileData({
      authToken: request.cookies.get('auth_token')?.value,
      date,
      sentenceId,
      search,
      limit: limit ?? 20,
      offset: offset ?? 0,
    });
    if (!result.ok) {
      const status =
        result.error.code === 'NOT_AUTHENTICATED'
          ? 401
          : result.error.code === 'INVALID_TOKEN'
            ? 401
            : 404;
      return NextResponse.json({ error: result.error.message }, { status });
    }

    const parsedResponse = legacyProfileResponseSchema.safeParse(result.data);
    if (!parsedResponse.success) {
      console.error('Invalid profile response payload:', parsedResponse.error.flatten());
      return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }

    return NextResponse.json(parsedResponse.data);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
  }
}
