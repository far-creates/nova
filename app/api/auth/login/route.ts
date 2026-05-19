import { verifyUserPassword } from '@/lib/users';
import { createToken } from '@/lib/auth';
import {
  legacyAuthSuccessSchema,
  legacyLoginRequestSchema,
} from '@/packages/api/src/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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

    const { email, password } = parsedBody.data;

    // Verify user
 
    const user = await verifyUserPassword(email, password);
   
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    const token = createToken(user.id);
    const responsePayload = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
    };
    const parsedResponse = legacyAuthSuccessSchema.safeParse(responsePayload);
    if (!parsedResponse.success) {
      console.error('Invalid login response payload:', parsedResponse.error.flatten());
      return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
