import { NextResponse } from 'next/server';
import { getTrackLibrary } from '@/packages/application/src/tracks';
import { legacyTrackListResponseSchema } from '@/packages/api/src/tracks';

export async function tracksGetHandler() {
  try {
    const tracks = await getTrackLibrary();
    const parsedResponse = legacyTrackListResponseSchema.safeParse(tracks);

    if (!parsedResponse.success) {
      console.error('Invalid tracks response payload:', parsedResponse.error.flatten());
      return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
    }

    return NextResponse.json(parsedResponse.data);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
