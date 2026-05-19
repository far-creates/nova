import { getUserById } from '@/lib/users';
import { verifyToken } from '@/lib/auth';
import { legacyMeResponseSchema } from '@/packages/api/src/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const parsedResponse = legacyMeResponseSchema.safeParse({ user });
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
