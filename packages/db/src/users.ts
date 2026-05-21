import { hashPassword, verifyPassword } from '../../../lib/auth';
import { getConnection } from './connection';

export interface User {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
}

function mapUser(user: {
  id: string;
  email: string;
  username: string | null;
  createdAt: Date;
}): User {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const prisma = await getConnection();
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true, createdAt: true },
  });

  return user ? mapUser(user) : null;
}

export async function getUserById(id: string): Promise<User | null> {
  const prisma = await getConnection();
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, username: true, createdAt: true },
  });

  return user ? mapUser(user) : null;
}

export async function createUser(email: string, password: string, username?: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const prisma = await getConnection();
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      username: username || null,
    },
    select: { id: true, email: true, username: true, createdAt: true },
  });

  return mapUser(user);
}

export async function verifyUserPassword(email: string, password: string): Promise<User | null> {
  try {
    const prisma = await getConnection();
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) return null;

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) return null;

    return mapUser(user);
  } catch {
    console.error('[verifyUserPassword] Internal error');
    return null;
  }
}
