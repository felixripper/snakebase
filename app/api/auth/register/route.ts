import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/user-store';
import { getAppRouterSession } from '@/lib/session';
import { z } from 'zod';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  username: z.string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
    .max(20, 'Kullanıcı adı en fazla 20 karakter olmalıdır')
    .regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),
  password: z.string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message);
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }

    const { email, username, password } = validation.data;

    // Create user
    const user = await createUser(email, username, password);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Bu email veya kullanıcı adı zaten kullanılıyor' },
        { status: 409 }
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
      message: 'Kayıt başarılı',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: 'Kayıt sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
