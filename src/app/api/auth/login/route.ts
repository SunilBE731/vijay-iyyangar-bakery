import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vijay-iyengar-secret-key-12345';
const ADMIN_EMAIL = 'admin@vijayiyengar.com';
const ADMIN_PASSWORD = 'admin123';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create token
      const token = jwt.sign(
        { email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      const response = NextResponse.json(
        { success: true, message: 'Authentication successful', token },
        { status: 200 }
      );

      // Set cookie for browser sessions
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 1 day
        path: '/'
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
