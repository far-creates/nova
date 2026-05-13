// app/api/attempts/route.ts

import { getSentenceById, createAttempt } from '@/lib/sentences';
import { compareTexts } from '@/lib/compareTexts';
import { verifyToken } from '@/lib/auth';
import { getSentenceByTrackId } from '@/lib/tracks';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sentenceId, audioTrackId, userText, saveAttempt = false } = body;

    if ((!sentenceId && !audioTrackId) || !userText) {
      return NextResponse.json(
        { error: 'audioTrackId (or sentenceId) and userText are required' },
        { status: 400 }
      );
    }

    const sentence = audioTrackId
      ? await getSentenceByTrackId(audioTrackId)
      : await getSentenceById(sentenceId);

    if (!sentence) {
      return NextResponse.json(
        { error: 'Sentence not found for the selected track' },
        { status: 404 }
      );
    }

    // Compare texts
    const correction = compareTexts(sentence.text, userText);

    // Save only when explicitly requested by the client
    if (saveAttempt) {
      await createAttempt(sentence.id, decoded.userId, userText);
    }

    return NextResponse.json({
      sentenceId: sentence.id,
      audioTrackId: audioTrackId ?? null,
      userText,
      ...correction,
    });
  } catch (error) {
    console.error('Error processing attempt:', error);
    return NextResponse.json(
      { error: 'Failed to process attempt' },
      { status: 500 }
    );
  }
}
