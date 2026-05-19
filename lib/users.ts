import { getConnection } from './db';
import { randomUUID } from 'crypto';
import { hashPassword, verifyPassword } from './auth';

export interface User {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const pool = await getConnection();
  const result = await pool.request()
    .input('email', email)
    .query('SELECT id, email, username, createdAt FROM [User] WHERE email = @email');
  return result.recordset[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', id)
    .query('SELECT id, email, username, createdAt FROM [User] WHERE id = @id');
  return result.recordset[0] || null;
}

export async function createUser(email: string, password: string, username?: string): Promise<User> {
  const id = randomUUID();
  const hashedPassword = await hashPassword(password);
  
  const pool = await getConnection();
  await pool.request()
    .input('id', id)
    .input('email', email)
    .input('password', hashedPassword)
    .input('username', username || null)
    .query('INSERT INTO [User] (id, email, password, username) VALUES (@id, @email, @password, @username)');
  
  return { id, email, username: username || null, createdAt: new Date().toISOString() };
}

export async function verifyUserPassword(email: string, password: string): Promise<User | null> {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', email)
      .query('SELECT id, email, password, username, createdAt FROM [User] WHERE email = @email');
    
    const user = result.recordset[0];
    if (!user) return null;

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return null;
    
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    };
  } catch {
    // Log a generic error without sensitive context.
    console.error('[verifyUserPassword] Internal error');
    return null;
  }
}
