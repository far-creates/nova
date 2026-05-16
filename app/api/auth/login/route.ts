import { verifyUserPassword } from '@/lib/users';
import { createToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password length:', password?.length);

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Verify user
    console.log('Calling verifyUserPassword...');
    const user = await verifyUserPassword(email, password);
    
    console.log('User result:', user);

    if (!user) {
      console.log('User verification failed - invalid credentials');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('User verified successfully:', user.id);
    const token = createToken(user.id);
    console.log('Token created');

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

    console.log('Login successful for:', email);
    return response;
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error object:', error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { error: 'Failed to login', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}