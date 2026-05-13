import { getSentences } from '@/lib/sentences';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sentences = await getSentences();
    return NextResponse.json(sentences);
  } catch (error) {
    console.error('Error fetching sentences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sentences' },
      { status: 500 }
    );
  }
}
