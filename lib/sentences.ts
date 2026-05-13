import { getConnection } from './db';
import { randomUUID } from 'crypto';

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

export async function getSentences(): Promise<Sentence[]> {
  const pool = await getConnection();
  const result = await pool.request().query('SELECT * FROM Sentence');
  return result.recordset;
}

export async function getSentenceById(id: string): Promise<Sentence | null> {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', id)
    .query('SELECT * FROM Sentence WHERE id = @id');
  return result.recordset[0] || null;
}

export async function createAttempt(sentenceId: string, userId: string, userText: string): Promise<Attempt> {
  const pool = await getConnection();
  const id = randomUUID();
  await pool.request()
    .input('id', id)
    .input('sentenceId', sentenceId)
    .input('userId', userId)
    .input('userText', userText)
    .query('INSERT INTO Attempt (id, sentenceId, userId, userText) VALUES (@id, @sentenceId, @userId, @userText)');
  return { id, sentenceId, userId, userText, createdAt: new Date().toISOString() };
}

export async function createSentence(
  text: string,
  difficulty: string,
  audioTrackId?: string
): Promise<Sentence> {
  const pool = await getConnection();
  const id = randomUUID();
  await pool.request()
    .input('id', id)
    .input('text', text)
    .input('difficulty', difficulty)
    .input('audioTrackId', audioTrackId ?? null)
    .query(`
      INSERT INTO Sentence (id, text, difficulty, audioTrackId)
      VALUES (@id, @text, @difficulty, @audioTrackId)
    `);
  return { id, text, difficulty, createdAt: new Date().toISOString() };
}
