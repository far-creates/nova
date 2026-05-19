import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import { NextRequest } from 'next/server';

let verifyTokenResult: { userId: string } | null = { userId: 'user-1' };
const sentenceResult = { id: 'sentence-1', text: 'hello world' };
const correctionResult = {
  correct: [0, 1, 2],
  wrong: [{ index: 3, expected: 'l', got: 'x' }],
  extra: [] as Array<{ index: number; char: string }>,
  accuracy: 75,
};
let createAttemptCalls: Array<[string, string, string]> = [];

mock.module('@/lib/auth', {
  namedExports: {
    verifyToken: () => verifyTokenResult,
  },
});

mock.module('@/lib/sentences', {
  namedExports: {
    getSentenceById: async () => sentenceResult,
    createAttempt: async (...args: [string, string, string]) => {
      createAttemptCalls.push(args);
    },
  },
});

mock.module('@/lib/tracks', {
  namedExports: {
    getSentenceByTrackId: async () => sentenceResult,
  },
});

mock.module('@/lib/compareTexts', {
  namedExports: {
    compareTexts: () => correctionResult,
  },
});

const attemptsRoutePromise = import('../../app/api/attempts/route');

test('POST /api/attempts returns 400 for invalid payloads', async () => {
  const { POST } = await attemptsRoutePromise;
  verifyTokenResult = { userId: 'user-1' };

  const request = new NextRequest('http://localhost/api/attempts', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: 'auth_token=test-token',
    },
    body: JSON.stringify({ audioTrackId: '', userText: '' }),
  });

  const response = await POST(request);
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid attempt payload');
});

test('POST /api/attempts returns correction data without saving by default', async () => {
  const { POST } = await attemptsRoutePromise;
  createAttemptCalls = [];
  verifyTokenResult = { userId: 'user-1' };

  const request = new NextRequest('http://localhost/api/attempts', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: 'auth_token=test-token',
    },
    body: JSON.stringify({
      audioTrackId: 'track-1',
      userText: 'hello xorld',
    }),
  });

  const response = await POST(request);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.sentenceId, 'sentence-1');
  assert.equal(body.audioTrackId, 'track-1');
  assert.equal(body.accuracy, 75);
  assert.equal(createAttemptCalls.length, 0);
});

test('POST /api/attempts allows guest correction requests without auth', async () => {
  const { POST } = await attemptsRoutePromise;
  createAttemptCalls = [];
  verifyTokenResult = null;

  const request = new NextRequest('http://localhost/api/attempts', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      audioTrackId: 'track-1',
      userText: 'hello xorld',
      guestSessionId: 'guest-1',
    }),
  });

  const response = await POST(request);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.sentenceId, 'sentence-1');
  assert.equal(body.audioTrackId, 'track-1');
  assert.equal(body.accuracy, 75);
  assert.equal(createAttemptCalls.length, 0);
});

test('POST /api/attempts saves when saveAttempt is true', async () => {
  const { POST } = await attemptsRoutePromise;
  createAttemptCalls = [];
  verifyTokenResult = { userId: 'user-1' };

  const request = new NextRequest('http://localhost/api/attempts', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: 'auth_token=test-token',
    },
    body: JSON.stringify({
      audioTrackId: 'track-1',
      userText: 'hello xorld',
      saveAttempt: true,
    }),
  });

  const response = await POST(request);

  assert.equal(response.status, 200);
  assert.equal(createAttemptCalls.length, 1);
  assert.deepEqual(createAttemptCalls[0], ['sentence-1', 'user-1', 'hello xorld']);
});

test('POST /api/attempts rejects guest save requests without auth', async () => {
  const { POST } = await attemptsRoutePromise;
  createAttemptCalls = [];
  verifyTokenResult = null;

  const request = new NextRequest('http://localhost/api/attempts', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      audioTrackId: 'track-1',
      userText: 'hello xorld',
      saveAttempt: true,
      guestSessionId: 'guest-1',
    }),
  });

  const response = await POST(request);
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error, 'Not authenticated');
  assert.equal(createAttemptCalls.length, 0);
});
