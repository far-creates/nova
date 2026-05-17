import { verifyUserPassword } from '@/lib/users';
import { createToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Verify user
 
    const user = await verifyUserPassword(email, password);
   
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    const token = createToken(user.id);
    const response = NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      } 
    });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });


    return response;
  } catch (error) {

    
    return NextResponse.json(
      { error: 'Failed to login', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}