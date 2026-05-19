import { NextResponse } from 'next/server';
import { legacyLogoutResponseSchema } from '@/packages/api/src/auth';

export async function POST() {
  const payload = legacyLogoutResponseSchema.parse({ message: 'Logged out' });
  const response = NextResponse.json(payload);
  response.cookies.delete('auth_token');
  return response;
}
