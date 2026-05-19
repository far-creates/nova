import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import { NextRequest } from 'next/server';

type MockUser = {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
};

let verifyUserPasswordResult: MockUser | null = null;
let getUserByEmailResult: MockUser | null = null;
let createUserResult: MockUser = {
  id: 'user-2',
  email: 'new@example.com',
  username: 'new-user',
  createdAt: '2026-05-19T00:00:00.000Z',
};
let getUserByIdResult: MockUser | null = null;
let verifyTokenResult: { userId: string } | null = { userId: 'user-1' };
const createdToken = 'jwt-token';

mock.module('@/lib/users', {
  namedExports: {
    verifyUserPassword: async () => verifyUserPasswordResult,
    getUserByEmail: async () => getUserByEmailResult,
    createUser: async () => createUserResult,
    getUserById: async () => getUserByIdResult,
  },
});

mock.module('@/lib/auth', {
  namedExports: {
    createToken: () => createdToken,
    verifyToken: () => verifyTokenResult,
  },
});

const loginRoutePromise = import('../../app/api/auth/login/route');
const signupRoutePromise = import('../../app/api/auth/signup/route');
const meRoutePromise = import('../../app/api/auth/me/route');
const logoutRoutePromise = import('../../app/api/auth/logout/route');

test('POST /api/auth/login validates payloads', async () => {
  const loginRoute = await loginRoutePromise;
  const request = new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', password: '' }),
  });

  const response = await loginRoute.POST(request);
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid login payload');
});

test('POST /api/auth/login returns validated user payload and cookie', async () => {
  const loginRoute = await loginRoutePromise;
  verifyUserPasswordResult = {
    id: 'user-1',
    email: 'user@example.com',
    username: 'demo-user',
    createdAt: '2026-05-19T00:00:00.000Z',
  };

  const request = new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', password: 'secret123' }),
  });

  const response = await loginRoute.POST(request);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.user.email, 'user@example.com');
  assert.match(response.headers.get('set-cookie') ?? '', /auth_token=jwt-token/);
});

test('POST /api/auth/signup returns user data without exposing token in body', async () => {
  const signupRoute = await signupRoutePromise;
  getUserByEmailResult = null;
  createUserResult = {
    id: 'user-2',
    email: 'new@example.com',
    username: 'new-user',
    createdAt: '2026-05-19T00:00:00.000Z',
  };

  const request = new NextRequest('http://localhost/api/auth/signup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'new@example.com',
      username: 'new-user',
      password: 'secret123',
    }),
  });

  const response = await signupRoute.POST(request);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.user.email, 'new@example.com');
  assert.equal('token' in body, false);
});

test('GET /api/auth/me returns current user when token is valid', async () => {
  const meRoute = await meRoutePromise;
  verifyTokenResult = { userId: 'user-1' };
  getUserByIdResult = {
    id: 'user-1',
    email: 'user@example.com',
    username: 'demo-user',
    createdAt: '2026-05-19T00:00:00.000Z',
  };

  const request = new NextRequest('http://localhost/api/auth/me', {
    method: 'GET',
    headers: {
      cookie: 'auth_token=jwt-token',
    },
  });

  const response = await meRoute.GET(request);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.user.id, 'user-1');
});

test('POST /api/auth/logout clears the auth cookie', async () => {
  const logoutRoute = await logoutRoutePromise;
  const response = await logoutRoute.POST();
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.message, 'Logged out');
  assert.match(response.headers.get('set-cookie') ?? '', /auth_token=;/);
});
