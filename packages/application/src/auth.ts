import { createToken, verifyToken } from '@/lib/auth';
import { createUser, getUserByEmail, getUserById, verifyUserPassword } from '@/packages/db/src';

type AppErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_TAKEN'
  | 'NOT_AUTHENTICATED'
  | 'INVALID_TOKEN'
  | 'USER_NOT_FOUND';

export interface ApplicationError {
  code: AppErrorCode;
  message: string;
}

export interface AuthUserView {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
}

export interface AuthSuccessResult {
  user: AuthUserView;
  token: string;
}

function toAuthUserView(user: {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
}): AuthUserView {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ ok: true; data: AuthSuccessResult } | { ok: false; error: ApplicationError }> {
  const user = await verifyUserPassword(input.email, input.password);

  if (!user) {
    return {
      ok: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
    };
  }

  return {
    ok: true,
    data: {
      user: toAuthUserView(user),
      token: createToken(user.id),
    },
  };
}

export async function signupUser(input: {
  email: string;
  password: string;
  username: string;
}): Promise<{ ok: true; data: AuthSuccessResult } | { ok: false; error: ApplicationError }> {
  const existing = await getUserByEmail(input.email);

  if (existing) {
    return {
      ok: false,
      error: { code: 'EMAIL_TAKEN', message: 'Email already registered' },
    };
  }

  const user = await createUser(input.email, input.password, input.username);

  return {
    ok: true,
    data: {
      user: toAuthUserView(user),
      token: createToken(user.id),
    },
  };
}

export async function getAuthenticatedUser(input: {
  token?: string;
}): Promise<{ ok: true; data: AuthUserView } | { ok: false; error: ApplicationError }> {
  if (!input.token) {
    return {
      ok: false,
      error: { code: 'NOT_AUTHENTICATED', message: 'Not authenticated' },
    };
  }

  const decoded = verifyToken(input.token);
  if (!decoded) {
    return {
      ok: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
    };
  }

  const user = await getUserById(decoded.userId);
  if (!user) {
    return {
      ok: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found' },
    };
  }

  return { ok: true, data: toAuthUserView(user) };
}

export async function resolveAuthenticatedUserId(input: {
  token?: string;
}): Promise<{ ok: true; userId: string } | { ok: false; error: ApplicationError }> {
  if (!input.token) {
    return {
      ok: false,
      error: { code: 'NOT_AUTHENTICATED', message: 'Not authenticated' },
    };
  }

  const decoded = verifyToken(input.token);
  if (!decoded) {
    return {
      ok: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
    };
  }

  return { ok: true, userId: decoded.userId };
}
