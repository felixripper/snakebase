import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getUserByUsername, verifyPassword } from '@/lib/user-store';
import { getAppRouterSession } from '@/lib/session';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  identifier: z.string().min(1, 'Email veya kullanıcı adı giriniz'), // Email or username
  password: z.string().min(1, 'Şifre giriniz'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message);
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }

    const { identifier, password } = validation.data;

    // Try to find user by email or username
    let user = await getUserByEmail(identifier);
    if (!user) {
      user = await getUserByUsername(identifier);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı adı/email veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı adı/email veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Create session
    const session = await getAppRouterSession();
    session.isLoggedIn = true;
    session.userId = user.id;
    session.userEmail = user.email;
    session.username = user.username;
    session.isAdmin = false;
    await session.save();

    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        walletAddress: user.walletAddress,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Giriş sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
