import {
  legacyAttemptRequestSchema,
  legacyAttemptResponseSchema,
  type LegacyAttemptRequest,
  type LegacyAttemptResponse,
} from './attempts';
import {
  legacyLoginRequestSchema,
  legacyLoginResponseSchema,
  legacyLogoutResponseSchema,
  legacyMeResponseSchema,
  legacySignupRequestSchema,
  legacySignupResponseSchema,
  type LegacyLoginRequest,
  type LegacyLoginResponse,
  type LegacyLogoutResponse,
  type LegacyMeResponse,
  type LegacySignupRequest,
  type LegacySignupResponse,
} from './auth';
import {
  legacyProfileQuerySchema,
  legacyProfileResponseSchema,
  type LegacyProfileQuery,
  type LegacyProfileResponse,
} from './profile';
import {
  legacyTrackListResponseSchema,
  type LegacyTrackListResponse,
} from './tracks';

async function parseJsonResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      typeof data?.error === 'string' ? data.error : 'Request failed';
    throw new Error(errorMessage);
  }

  return data;
}

export async function loginWithLegacyAuth(
  payload: LegacyLoginRequest,
  init?: RequestInit
): Promise<LegacyLoginResponse> {
  const body = legacyLoginRequestSchema.parse(payload);

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
    body: JSON.stringify(body),
    ...init,
  });

  const data = await parseJsonResponse(response);
  return legacyLoginResponseSchema.parse(data);
}

export async function signupWithLegacyAuth(
  payload: LegacySignupRequest,
  init?: RequestInit
): Promise<LegacySignupResponse> {
  const body = legacySignupRequestSchema.parse(payload);

  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
    body: JSON.stringify(body),
    ...init,
  });

  const data = await parseJsonResponse(response);
  return legacySignupResponseSchema.parse(data);
}

export async function fetchLegacyAuthMe(
  init?: RequestInit
): Promise<LegacyMeResponse> {
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
    ...init,
  });

  const data = await parseJsonResponse(response);
  return legacyMeResponseSchema.parse(data);
}

export async function logoutLegacyAuth(
  init?: RequestInit
): Promise<LegacyLogoutResponse> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    ...init,
  });

  const data = await parseJsonResponse(response);
  return legacyLogoutResponseSchema.parse(data);
}

export async function fetchLegacyTracks(
  init?: RequestInit
): Promise<LegacyTrackListResponse> {
  const response = await fetch('/api/tracks', {
    method: 'GET',
    ...init,
  });

  const data = await parseJsonResponse(response);
  return legacyTrackListResponseSchema.parse(data);
}

export async function fetchLegacyProfile(
  params: LegacyProfileQuery = {},
  init?: RequestInit
): Promise<LegacyProfileResponse> {
  const parsedParams = legacyProfileQuerySchema.parse(params);
  const searchParams = new URLSearchParams();

  if (parsedParams.date) searchParams.set('date', parsedParams.date);
  if (parsedParams.sentenceId) searchParams.set('sentenceId', parsedParams.sentenceId);
  if (parsedParams.search) searchParams.set('search', parsedParams.search);
  if (parsedParams.limit !== undefined) searchParams.set('limit', String(parsedParams.limit));
  if (parsedParams.offset !== undefined) searchParams.set('offset', String(parsedParams.offset));

  const response = await fetch(`/api/profile?${searchParams.toString()}`, {
    method: 'GET',
    credentials: 'include',
    ...init,
  });

  const data = await parseJsonResponse(response);
  return legacyProfileResponseSchema.parse(data);
}

export async function submitLegacyAttempt(
  payload: LegacyAttemptRequest,
  init?: RequestInit
): Promise<LegacyAttemptResponse> {
  const body = legacyAttemptRequestSchema.parse(payload);

  const response = await fetch('/api/attempts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
    ...init,
  });

  const data = await parseJsonResponse(response);
  return legacyAttemptResponseSchema.parse(data);
}
