import { getConnection } from './connection';
import { Sentence } from './sentences';

export interface AudioTrack {
  id: string;
  title: string;
  filePath: string;
  difficulty: string;
  createdAt: string;
}

function mapTrack(track: {
  id: string;
  title: string;
  filePath: string;
  difficulty: string;
  createdAt: Date;
}): AudioTrack {
  return {
    id: track.id,
    title: track.title,
    filePath: track.filePath,
    difficulty: track.difficulty,
    createdAt: track.createdAt.toISOString(),
  };
}

export async function ensureAudioSchema() {
  const prisma = await getConnection();
  await prisma.$connect();
}

export async function getTracks(): Promise<AudioTrack[]> {
  const prisma = await getConnection();
  const tracks = await prisma.audioTrack.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, filePath: true, difficulty: true, createdAt: true },
  });

  return tracks.map(mapTrack);
}

export async function getSentenceByTrackId(trackId: string): Promise<Sentence | null> {
  const prisma = await getConnection();
  const sentence = await prisma.sentence.findUnique({
    where: { audioTrackId: trackId },
    select: { id: true, text: true, difficulty: true, createdAt: true },
  });

  return sentence
    ? {
        id: sentence.id,
        text: sentence.text,
        difficulty: sentence.difficulty,
        createdAt: sentence.createdAt.toISOString(),
      }
    : null;
}

export async function upsertTrackWithSentence(input: {
  trackFile: string;
  title: string;
  difficulty: string;
  sentence: string;
}) {
  await ensureAudioSchema();
  const prisma = await getConnection();
  const filePath = `/audio/${input.trackFile}`;

  await prisma.$transaction(async (tx) => {
    const track = await tx.audioTrack.upsert({
      where: { filePath },
      update: {
        title: input.title,
        difficulty: input.difficulty,
      },
      create: {
        title: input.title,
        filePath,
        difficulty: input.difficulty,
      },
      select: { id: true },
    });

    await tx.sentence.upsert({
      where: { audioTrackId: track.id },
      update: {
        text: input.sentence,
        difficulty: input.difficulty,
      },
      create: {
        text: input.sentence,
        difficulty: input.difficulty,
        audioTrackId: track.id,
      },
    });
  });
}
