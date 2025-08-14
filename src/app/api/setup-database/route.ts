import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check if DATABASE_URL is set
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'DATABASE_URL environment variable is not set'
        },
        { status: 500 }
      );
    }

    // Test database connection
    await prisma.$connect();
    
    // Check if tables exist by trying to query them
    const adminCount = await prisma.admin.count();
    const teacherCount = await prisma.teacher.count();
    const studentCount = await prisma.student.count();
    const parentCount = await prisma.parent.count();
    
    return NextResponse.json(
      { 
        status: 'success',
        message: 'Database is connected and tables exist',
        counts: {
          admins: adminCount,
          teachers: teacherCount,
          students: studentCount,
          parents: parentCount
        },
        databaseUrl: databaseUrl ? `${databaseUrl.split('@')[1]?.split('/')[0] || 'hidden'}` : 'not set'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Database setup error:', error);
    
    // If tables don't exist, this is likely a migration issue
    if (error instanceof Error && error.message.includes('does not exist')) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Database tables do not exist. Please run migrations.',
          error: error.message,
          solution: 'Run: npx prisma migrate deploy'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
