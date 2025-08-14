import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    // Parse the connection string to check format
    let parsedUrl = null;
    if (databaseUrl) {
      try {
        parsedUrl = new URL(databaseUrl);
      } catch (e) {
        parsedUrl = { error: 'Invalid URL format' };
      }
    }
    
    return NextResponse.json(
      { 
        status: 'info',
        environment: process.env.NODE_ENV,
        databaseUrl: databaseUrl ? 'Set' : 'Not set',
        parsedUrl: parsedUrl,
        hasPassword: databaseUrl ? databaseUrl.includes('Sachin@1264!') : false,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Error checking environment',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
