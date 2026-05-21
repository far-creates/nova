import { getConnection } from './connection';

export interface Sentence {
  id: string;
  text: string;
  difficulty: string;
  createdAt: string;
}

export interface Attempt {
  id: string;
  sentenceId: string;
  userId: string;
  userText: string;
  createdAt: string;
}

function mapSentence(sentence: {
  id: string;
  text: string;
  difficulty: string;
  createdAt: Date;
}): Sentence {
  return {
    id: sentence.id,
    text: sentence.text,
    difficulty: sentence.difficulty,
    createdAt: sentence.createdAt.toISOString(),
  };
}

export async function getSentences(): Promise<Sentence[]> {
  const prisma = await getConnection();
  const sentences = await prisma.sentence.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, text: true, difficulty: true, createdAt: true },
  });

  return sentences.map(mapSentence);
}

export async function getSentenceById(id: string): Promise<Sentence | null> {
  const prisma = await getConnection();
  const sentence = await prisma.sentence.findUnique({
    where: { id },
    select: { id: true, text: true, difficulty: true, createdAt: true },
  });

  return sentence ? mapSentence(sentence) : null;
}

export async function createAttempt(sentenceId: string, userId: string, userText: string): Promise<Attempt> {
  const prisma = await getConnection();
  const attempt = await prisma.attempt.create({
    data: {
      sentenceId,
      userId,
      userText,
    },
    select: { id: true, sentenceId: true, userId: true, userText: true, createdAt: true },
  });

  return {
    ...attempt,
    createdAt: attempt.createdAt.toISOString(),
  };
}

export async function createSentence(
  text: string,
  difficulty: string,
  audioTrackId?: string
): Promise<Sentence> {
  const prisma = await getConnection();
  const sentence = await prisma.sentence.create({
    data: {
      text,
      difficulty,
      audioTrackId: audioTrackId ?? null,
    },
    select: { id: true, text: true, difficulty: true, createdAt: true },
  });

  return mapSentence(sentence);
}
