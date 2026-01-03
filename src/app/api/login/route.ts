import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.json();
  const token = body.token;

  // Set token in cookie
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 10, // 10 hour
  });

  return NextResponse.json({ message: 'Cookie set successfully' });
}

export async function DELETE() {
    cookies().delete('token');
    return NextResponse.json({ message: 'Token removed' });
  }

export async function GET() {
  const token = cookies().get('token')?.value
  return NextResponse.json({ token })
}  
