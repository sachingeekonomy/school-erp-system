import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    return NextResponse.json({
      error: "DATABASE_URL not found in environment variables",
      success: false
    }, { status: 500 });
  }
  
  // Check if it's a valid PostgreSQL URL
  const isValidPostgresUrl = databaseUrl.startsWith('postgresql://');
  const hasRailwayHost = databaseUrl.includes('railway') || databaseUrl.includes('rlwy.net');
  
  return NextResponse.json({
    success: true,
    hasDatabaseUrl: !!databaseUrl,
    isValidPostgresUrl,
    hasRailwayHost,
    urlPreview: databaseUrl.substring(0, 50) + '...',
    urlLength: databaseUrl.length,
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
  });
}
