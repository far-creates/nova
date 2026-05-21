import { calculateAccuracy } from '../../../lib/accuracy';
import { getConnection } from './connection';

export interface AttemptWithSentence {
  id: string;
  sentenceId: string;
  sentenceText: string;
  userText: string;
  accuracy: number;
  createdAt: string;
}

export interface UserStats {
  totalAttempts: number;
  averageAccuracy: number;
  bestAccuracy: number;
  worstAccuracy: number;
  lastAttempt: string | null;
}

export interface DailySummary {
  date: string;
  attemptsCount: number;
  averageAccuracy: number;
  bestAccuracy: number;
  worstAccuracy: number;
}

export interface AttemptsQuery {
  date?: string;
  sentenceId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface AttemptsResult {
  attempts: AttemptWithSentence[];
  total: number;
}

export interface SentenceOption {
  sentenceId: string;
  sentenceText: string;
}

function toLocalDateKey(input: string | Date): string {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function mapAttempt(attempt: {
  id: string;
  sentenceId: string;
  userText: string;
  createdAt: Date;
  sentence: {
    text: string;
  };
}): AttemptWithSentence {
  return {
    id: attempt.id,
    sentenceId: attempt.sentenceId,
    sentenceText: attempt.sentence.text,
    userText: attempt.userText,
    accuracy: calculateAccuracy(attempt.sentence.text, attempt.userText),
    createdAt: attempt.createdAt.toISOString(),
  };
}

export async function getUserAttempts(userId: string): Promise<AttemptWithSentence[]> {
  try {
    const prisma = await getConnection();
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        sentenceId: true,
        userText: true,
        createdAt: true,
        sentence: {
          select: {
            text: true,
          },
        },
      },
    });
    return attempts.map(mapAttempt);
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    return [];
  }
}

export async function getUserAttemptsFiltered(
  userId: string,
  query: AttemptsQuery = {}
): Promise<AttemptsResult> {
  try {
    const prisma = await getConnection();
    const limit = query.limit ?? 20;
    const offset = query.offset ?? 0;
    const where: {
      userId: string;
      sentenceId?: string;
      createdAt?: { gte: Date; lt: Date };
      OR?: Array<{
        userText?: { contains: string; mode: 'insensitive' };
        sentence?: { text: { contains: string; mode: 'insensitive' } };
      }>;
    } = { userId };

    if (query.date) {
      const start = new Date(`${query.date}T00:00:00.000Z`);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      where.createdAt = { gte: start, lt: end };
    }

    if (query.sentenceId) {
      where.sentenceId = query.sentenceId;
    }

    if (query.search) {
      where.OR = [
        { userText: { contains: query.search, mode: 'insensitive' } },
        { sentence: { text: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [total, attempts] = await Promise.all([
      prisma.attempt.count({ where }),
      prisma.attempt.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          sentenceId: true,
          userText: true,
          createdAt: true,
          sentence: {
            select: {
              text: true,
            },
          },
        },
      }),
    ]);

    return {
      attempts: attempts.map(mapAttempt),
      total,
    };
  } catch (error) {
    console.error('Error fetching filtered user attempts:', error);
    return { attempts: [], total: 0 };
  }
}

export async function getUserDailySummaries(userId: string): Promise<DailySummary[]> {
  try {
    const attempts = await getUserAttempts(userId);
    const grouped = new Map<string, number[]>();

    for (const attempt of attempts) {
      const date = toLocalDateKey(attempt.createdAt);
      const list = grouped.get(date) ?? [];
      list.push(attempt.accuracy);
      grouped.set(date, list);
    }

    return Array.from(grouped.entries())
      .map(([date, accuracies]) => ({
        date,
        attemptsCount: accuracies.length,
        averageAccuracy: Math.round((accuracies.reduce((a, b) => a + b, 0) / accuracies.length) * 100) / 100,
        bestAccuracy: Math.max(...accuracies),
        worstAccuracy: Math.min(...accuracies),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error('Error fetching daily summaries:', error);
    return [];
  }
}

export async function getUserSentenceOptions(userId: string): Promise<SentenceOption[]> {
  try {
    const prisma = await getConnection();
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      distinct: ['sentenceId'],
      orderBy: { sentenceId: 'asc' },
      select: {
        sentenceId: true,
        sentence: {
          select: {
            text: true,
          },
        },
      },
    });
    return attempts
      .map((attempt) => ({
        sentenceId: attempt.sentenceId,
        sentenceText: attempt.sentence.text,
      }))
      .sort((a, b) => a.sentenceText.localeCompare(b.sentenceText));
  } catch (error) {
    console.error('Error fetching sentence options:', error);
    return [];
  }
}

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    const attempts = await getUserAttempts(userId);
    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageAccuracy: 0,
        bestAccuracy: 0,
        worstAccuracy: 0,
        lastAttempt: null,
      };
    }

    const accuracies = attempts.map((attempt) => attempt.accuracy);

    return {
      totalAttempts: attempts.length,
      averageAccuracy: Math.round((accuracies.reduce((a, b) => a + b, 0) / accuracies.length) * 100) / 100,
      bestAccuracy: Math.max(...accuracies),
      worstAccuracy: Math.min(...accuracies),
      lastAttempt: attempts[0]?.createdAt || null,
    };
  } catch (error) {
    console.error('Error calculating user stats:', error);
    return {
      totalAttempts: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      worstAccuracy: 0,
      lastAttempt: null,
    };
  }
}

export async function getSentenceAccuracyForUser(
  userId: string,
  sentenceId: string
): Promise<{ count: number; averageAccuracy: number }> {
  try {
    const attempts = await getUserAttempts(userId);
    const sentenceAttempts = attempts.filter((a) => a.sentenceId === sentenceId);
    if (sentenceAttempts.length === 0) {
      return { count: 0, averageAccuracy: 0 };
    }

    const accuracies = sentenceAttempts.map((attempt) => attempt.accuracy);

    return {
      count: sentenceAttempts.length,
      averageAccuracy: Math.round((accuracies.reduce((a, b) => a + b, 0) / accuracies.length) * 100) / 100,
    };
  } catch (error) {
    console.error('Error getting sentence accuracy:', error);
    return { count: 0, averageAccuracy: 0 };
  }
}
