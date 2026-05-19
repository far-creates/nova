import { createUser, getUserByEmail } from '@/lib/users';
import { createToken } from '@/lib/auth';
import {
  legacyAuthSuccessSchema,
  legacySignupRequestSchema,
} from '@/packages/api/src/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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

    const { email, password, username } = parsedBody.data;

    // Check if user exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser(email, password, username);
    const token = createToken(user.id);

    const parsedResponse = legacyAuthSuccessSchema.safeParse({ user });
    if (!parsedResponse.success) {
      console.error('Invalid signup response payload:', parsedResponse.error.flatten());
      return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 });
    }

    const response = NextResponse.json(parsedResponse.data);
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to sign up' },
      { status: 500 }
    );
  }
}
