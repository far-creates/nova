import { randomUUID } from 'crypto';
import { getConnection } from './db';
import { Sentence } from './sentences';

export interface AudioTrack {
  id: string;
  title: string;
  filePath: string;
  difficulty: string;
  createdAt: string;
}

let schemaEnsured = false;

export async function ensureAudioSchema() {
  if (schemaEnsured) return;

  const pool = await getConnection();
  await pool.request().query(`
    IF OBJECT_ID('AudioTrack', 'U') IS NULL
    BEGIN
      CREATE TABLE AudioTrack (
        id NVARCHAR(50) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        filePath NVARCHAR(500) NOT NULL UNIQUE,
        difficulty NVARCHAR(50) DEFAULT 'easy',
        createdAt DATETIME DEFAULT GETDATE()
      )
    END
  `);

  await pool.request().query(`
    IF COL_LENGTH('Sentence', 'audioTrackId') IS NULL
    BEGIN
      ALTER TABLE Sentence ADD audioTrackId NVARCHAR(50) NULL
    END
  `);

  await pool.request().query(`
    IF NOT EXISTS (
      SELECT 1
      FROM sys.foreign_keys fk
      INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
      INNER JOIN sys.columns c ON c.object_id = fkc.parent_object_id AND c.column_id = fkc.parent_column_id
      INNER JOIN sys.tables t ON t.object_id = c.object_id
      WHERE t.name = 'Sentence' AND c.name = 'audioTrackId'
    )
    BEGIN
      ALTER TABLE Sentence
      ADD CONSTRAINT FK_Sentence_AudioTrack
      FOREIGN KEY (audioTrackId) REFERENCES AudioTrack(id)
    END
  `);

  schemaEnsured = true;
}

export async function getTracks(): Promise<AudioTrack[]> {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT id, title, filePath, difficulty, createdAt
    FROM AudioTrack
    ORDER BY createdAt DESC
  `);
  return result.recordset || [];
}

export async function getSentenceByTrackId(trackId: string): Promise<Sentence | null> {
  const pool = await getConnection();
  const result = await pool.request()
    .input('trackId', trackId)
    .query(`
      SELECT TOP 1 s.id, s.text, s.difficulty, s.createdAt
      FROM Sentence s
      WHERE s.audioTrackId = @trackId
    `);
  return result.recordset[0] || null;
}

export async function upsertTrackWithSentence(input: {
  trackFile: string;
  title: string;
  difficulty: string;
  sentence: string;
}) {
  await ensureAudioSchema();
  const pool = await getConnection();
  const filePath = `/audio/${input.trackFile}`;

  const trackResult = await pool.request()
    .input('filePath', filePath)
    .query('SELECT id FROM AudioTrack WHERE filePath = @filePath');

  let trackId = trackResult.recordset[0]?.id as string | undefined;
  if (!trackId) {
    trackId = randomUUID();
    await pool.request()
      .input('id', trackId)
      .input('title', input.title)
      .input('filePath', filePath)
      .input('difficulty', input.difficulty)
      .query(`
        INSERT INTO AudioTrack (id, title, filePath, difficulty)
        VALUES (@id, @title, @filePath, @difficulty)
      `);
  } else {
    await pool.request()
      .input('id', trackId)
      .input('title', input.title)
      .input('difficulty', input.difficulty)
      .query(`
        UPDATE AudioTrack
        SET title = @title, difficulty = @difficulty
        WHERE id = @id
      `);
  }

  const sentenceResult = await pool.request()
    .input('trackId', trackId)
    .query('SELECT id FROM Sentence WHERE audioTrackId = @trackId');

  const sentenceId = sentenceResult.recordset[0]?.id as string | undefined;
  if (!sentenceId) {
    await pool.request()
      .input('id', randomUUID())
      .input('text', input.sentence)
      .input('difficulty', input.difficulty)
      .input('trackId', trackId)
      .query(`
        INSERT INTO Sentence (id, text, difficulty, audioTrackId)
        VALUES (@id, @text, @difficulty, @trackId)
      `);
  } else {
    await pool.request()
      .input('id', sentenceId)
      .input('text', input.sentence)
      .input('difficulty', input.difficulty)
      .query(`
        UPDATE Sentence
        SET text = @text, difficulty = @difficulty
        WHERE id = @id
      `);
  }
}
