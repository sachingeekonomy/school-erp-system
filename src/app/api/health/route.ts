import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check if DATABASE_URL is set
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'DATABASE_URL environment variable is not set',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const adminCount = await prisma.admin.count();
    
    return NextResponse.json(
      { 
        status: 'healthy',
        message: 'Database connection successful',
        databaseUrl: databaseUrl ? `${databaseUrl.split('@')[1]?.split('/')[0] || 'hidden'}` : 'not set',
        adminCount,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : String(error),
        databaseUrl: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'hidden'}` : 'not set',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
