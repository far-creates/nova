import { NextRequest, NextResponse } from 'next/server';
import { submitAttempt } from '@/packages/application/src/attempts';
import { legacyAttemptRequestSchema, legacyAttemptResponseSchema } from '@/packages/api/src/attempts';

export async function attemptsPostHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedBody = legacyAttemptRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: 'Invalid attempt payload',
          details: parsedBody.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await submitAttempt({
      ...parsedBody.data,
      authToken: request.cookies.get('auth_token')?.value,
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

    const parsedResponse = legacyAttemptResponseSchema.safeParse(result.data);
    if (!parsedResponse.success) {
      console.error('Invalid attempt response payload:', parsedResponse.error.flatten());
      return NextResponse.json({ error: 'Failed to process attempt response' }, { status: 500 });
    }

    return NextResponse.json(parsedResponse.data);
  } catch (error) {
    console.error('Error processing attempt:', error);
    return NextResponse.json({ error: 'Failed to process attempt' }, { status: 500 });
  }
}
