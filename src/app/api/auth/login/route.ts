import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json();

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required' },
        { status: 400 }
      );
    }

    let user = null;

    // Check user based on role
    switch (role) {
      case 'admin':
        user = await prisma.admin.findUnique({
          where: { username }
        });
        break;
      case 'teacher':
        user = await prisma.teacher.findUnique({
          where: { username }
        });
        break;
      case 'student':
        user = await prisma.student.findUnique({
          where: { username }
        });
        break;
      case 'parent':
        user = await prisma.parent.findUnique({
          where: { username }
        });
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Simple password comparison (no encryption for demo)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create session data
    const sessionData = {
      id: user.id,
      username: user.username,
      role: role,
      name: 'name' in user ? user.name : '',
      surname: 'surname' in user ? user.surname : ''
    };

    // Set session cookie
    const response = NextResponse.json(
      { 
        success: true, 
        user: sessionData,
        message: 'Login successful' 
      },
      { status: 200 }
    );

    // Set session cookie (simple implementation for demo)
    response.cookies.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
    // Check if it's a database connection error
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('DATABASE_URL')) {
        return NextResponse.json(
          { 
            error: 'Database connection failed. Please check your DATABASE_URL configuration.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}
