import { NextResponse } from 'next/server';
import { getSentences } from '@/packages/db/src';

export async function sentencesGetHandler() {
  try {
    const sentences = await getSentences();
    return NextResponse.json(sentences);
  } catch (error) {
    console.error('Error fetching sentences:', error);
    return NextResponse.json({ error: 'Failed to fetch sentences' }, { status: 500 });
  }
}
