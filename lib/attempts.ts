import { getConnection } from './db';
import { calculateAccuracy } from './accuracy';

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

export async function getUserAttempts(userId: string): Promise<AttemptWithSentence[]> {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('userId', userId)
      .query(`
        SELECT
          a.id,
          a.sentenceId,
          s.text as sentenceText,
          a.userText,
          a.createdAt
        FROM Attempt a
        INNER JOIN Sentence s ON a.sentenceId = s.id
        WHERE a.userId = @userId
        ORDER BY a.createdAt DESC
      `);
    return result.recordset || [];
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
    const pool = await getConnection();
    const where: string[] = ['a.userId = @userId'];
    const limit = query.limit ?? 20;
    const offset = query.offset ?? 0;

    if (query.date) {
      where.push('CAST(a.createdAt AS DATE) = @date');
    }
    if (query.sentenceId) {
      where.push('a.sentenceId = @sentenceId');
    }
    if (query.search) {
      where.push('(s.text LIKE @search OR a.userText LIKE @search)');
    }

    const whereClause = where.join(' AND ');

    const countRequest = pool.request().input('userId', userId);
    const dataRequest = pool.request().input('userId', userId);

    if (query.date) {
      countRequest.input('date', query.date);
      dataRequest.input('date', query.date);
    }
    if (query.sentenceId) {
      countRequest.input('sentenceId', query.sentenceId);
      dataRequest.input('sentenceId', query.sentenceId);
    }
    if (query.search) {
      const search = `%${query.search}%`;
      countRequest.input('search', search);
      dataRequest.input('search', search);
    }

    dataRequest.input('limit', limit).input('offset', offset);

    const totalResult = await countRequest.query(`
      SELECT COUNT(1) as total
      FROM Attempt a
      INNER JOIN Sentence s ON a.sentenceId = s.id
      WHERE ${whereClause}
    `);

    const dataResult = await dataRequest.query(`
      SELECT
        a.id,
        a.sentenceId,
        s.text as sentenceText,
        a.userText,
        a.createdAt
      FROM Attempt a
      INNER JOIN Sentence s ON a.sentenceId = s.id
      WHERE ${whereClause}
      ORDER BY a.createdAt DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return {
      attempts: dataResult.recordset || [],
      total: totalResult.recordset[0]?.total ?? 0,
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
      const accuracy = calculateAccuracy(attempt.sentenceText, attempt.userText);
      const list = grouped.get(date) ?? [];
      list.push(accuracy);
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
    const pool = await getConnection();
    const result = await pool.request()
      .input('userId', userId)
      .query(`
        SELECT DISTINCT
          a.sentenceId,
          s.text as sentenceText
        FROM Attempt a
        INNER JOIN Sentence s ON a.sentenceId = s.id
        WHERE a.userId = @userId
        ORDER BY s.text
      `);
    return result.recordset || [];
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

    const accuracies = attempts.map((attempt) =>
      calculateAccuracy(attempt.sentenceText, attempt.userText)
    );

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

    const accuracies = sentenceAttempts.map((attempt) =>
      calculateAccuracy(attempt.sentenceText, attempt.userText)
    );

    return {
      count: sentenceAttempts.length,
      averageAccuracy: Math.round((accuracies.reduce((a, b) => a + b, 0) / accuracies.length) * 100) / 100,
    };
  } catch (error) {
    console.error('Error getting sentence accuracy:', error);
    return { count: 0, averageAccuracy: 0 };
  }
}
