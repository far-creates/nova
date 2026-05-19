import { getSentenceById, createAttempt } from '@/lib/sentences';
import { compareTexts } from '@/lib/compareTexts';
import { verifyToken } from '@/lib/auth';
import { getSentenceByTrackId } from '@/lib/tracks';
import { legacyAttemptRequestSchema, legacyAttemptResponseSchema } from '@/packages/api/src/attempts';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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

    const { sentenceId, audioTrackId, userText, saveAttempt } = parsedBody.data;
    const token = request.cookies.get('auth_token')?.value;
    const decoded = token ? verifyToken(token) : null;

    if (saveAttempt && !token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (saveAttempt && !decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const sentence = audioTrackId
      ? await getSentenceByTrackId(audioTrackId)
      : await getSentenceById(sentenceId!);

    if (!sentence) {
      return NextResponse.json(
        { error: 'Sentence not found for the selected track' },
        { status: 404 }
      );
    }

    // Compare texts
    const correction = compareTexts(sentence.text, userText);

    // Save only when explicitly requested by the client
    if (saveAttempt && decoded) {
      await createAttempt(sentence.id, decoded.userId, userText);
    }

    const responsePayload = {
      sentenceId: sentence.id,
      audioTrackId: audioTrackId ?? null,
      userText,
      ...correction,
    };

    const parsedResponse = legacyAttemptResponseSchema.safeParse(responsePayload);
    if (!parsedResponse.success) {
      console.error('Invalid attempt response payload:', parsedResponse.error.flatten());
      return NextResponse.json(
        { error: 'Failed to process attempt response' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResponse.data);
  } catch (error) {
    console.error('Error processing attempt:', error);
    return NextResponse.json(
      { error: 'Failed to process attempt' },
      { status: 500 }
    );
  }
}
