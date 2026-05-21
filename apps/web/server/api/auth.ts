import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, loginUser, signupUser } from '@/packages/application/src/auth';
import {
  legacyAuthSuccessSchema,
  legacyLoginRequestSchema,
  legacyLogoutResponseSchema,
  legacyMeResponseSchema,
  legacySignupRequestSchema,
} from '@/packages/api/src/auth';

function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function loginPostHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedBody = legacyLoginRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: 'Invalid login payload',
          details: parsedBody.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await loginUser(parsedBody.data);
    if (!result.ok) {
      return NextResponse.json({ error: result.error.message }, { status: 401 });
    }
    const responsePayload = { user: result.data.user };

    const parsedResponse = legacyAuthSuccessSchema.safeParse(responsePayload);
    if (!parsedResponse.success) {
      console.error('Invalid login response payload:', parsedResponse.error.flatten());
      return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
    }

    const response = NextResponse.json(parsedResponse.data);
    setAuthCookie(response, result.data.token);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}

export async function logoutPostHandler() {
  const payload = legacyLogoutResponseSchema.parse({ message: 'Logged out' });
  const response = NextResponse.json(payload);
  response.cookies.delete('auth_token');
  return response;
}

export async function meGetHandler(request: NextRequest) {
  try {
    const result = await getAuthenticatedUser({
      token: request.cookies.get('auth_token')?.value,
    });
    if (!result.ok) {
      const status =
        result.error.code === 'NOT_AUTHENTICATED'
          ? 401
          : result.error.code === 'INVALID_TOKEN'
            ? 401
            : 404;
      return NextResponse.json({ error: result.error.message }, { status });
    }

    const parsedResponse = legacyMeResponseSchema.safeParse({ user: result.data });
    if (!parsedResponse.success) {
      console.error('Invalid auth/me response payload:', parsedResponse.error.flatten());
      return NextResponse.json({ error: 'Auth error' }, { status: 500 });
    }

    return NextResponse.json(parsedResponse.data);
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Auth error' }, { status: 500 });
  }
}

export async function signupPostHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedBody = legacySignupRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: 'Invalid signup payload',
          details: parsedBody.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await signupUser(parsedBody.data);
    if (!result.ok) {
      return NextResponse.json({ error: result.error.message }, { status: 409 });
    }

    const parsedResponse = legacyAuthSuccessSchema.safeParse({ user: result.data.user });
    if (!parsedResponse.success) {
      console.error('Invalid signup response payload:', parsedResponse.error.flatten());
      return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 });
    }

    const response = NextResponse.json(parsedResponse.data);
    setAuthCookie(response, result.data.token);
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 });
  }
}
