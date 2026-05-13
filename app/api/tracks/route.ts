import { NextResponse } from 'next/server';
import { getTracks } from '@/lib/tracks';

export async function GET() {
  try {
    const tracks = await getTracks();
    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}
