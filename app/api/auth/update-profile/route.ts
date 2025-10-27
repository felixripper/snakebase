import { NextRequest, NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { getUserById, updateUsername, updateAvatar } from '@/lib/user-store';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const session = await getAppRouterSession();
  
  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  const contentType = request.headers.get('content-type') || '';

  // Handle avatar upload
  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await request.formData();
      const file = formData.get('avatar') as File;
      
      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 });
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars');
      await mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${user.id}_${Date.now()}.${ext}`;
      const filepath = join(uploadsDir, filename);

      // Write file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Update user avatar URL
      const avatarUrl = `/uploads/avatars/${filename}`;
      await updateAvatar(user.id, avatarUrl);

      return NextResponse.json({ success: true, avatarUrl });
    } catch (error) {
      console.error('Avatar upload error:', error);
      return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }
  }

  // Handle username update
  try {
    const body = await request.json();
    const { username } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid username' }, { status: 400 });
    }

    const trimmed = username.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      return NextResponse.json({ success: false, error: 'Username must be 3-20 characters' }, { status: 400 });
    }

    const success = await updateUsername(user.id, trimmed);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Username already taken' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Username update error:', error);
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}
