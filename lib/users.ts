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
    console.log('[verifyUserPassword] Starting for email:', email);
    
    const pool = await getConnection();
    console.log('[verifyUserPassword] Database connection established');
    
    const result = await pool.request()
      .input('email', email)
      .query('SELECT id, email, password, username, createdAt FROM [User] WHERE email = @email');
    
    console.log('[verifyUserPassword] Query result recordset length:', result.recordset?.length);
    
    const user = result.recordset[0];
    if (!user) {
      console.log('[verifyUserPassword] User not found for email:', email);
      return null;
    }

    console.log('[verifyUserPassword] User found:', { id: user.id, email: user.email });
    console.log('[verifyUserPassword] Stored password hash type:', typeof user.password);
    console.log('[verifyUserPassword] Stored password hash length:', user.password?.length);
    console.log('[verifyUserPassword] Stored password hash starts with:', user.password?.substring(0, 10));
    console.log('[verifyUserPassword] Input password length:', password.length);
    
    // Use the imported verifyPassword function
    console.log('[verifyUserPassword] Calling bcrypt compare...');
    const isValid = await verifyPassword(password, user.password);
    
    console.log('[verifyUserPassword] Password comparison result:', isValid);

    if (!isValid) {
      console.log('[verifyUserPassword] Password mismatch for user:', email);
      return null;
    }
    
    console.log('[verifyUserPassword] Password verified successfully');
    
    // Return user data WITHOUT password
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    };
  } catch (error) {
    console.error('[verifyUserPassword] ERROR:', error);
    console.error('[verifyUserPassword] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[verifyUserPassword] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return null;
  }
}