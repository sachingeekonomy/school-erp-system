import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL;
  
  return NextResponse.json({
    databaseUrl: databaseUrl ? `${databaseUrl.substring(0, 20)}...` : 'Not set',
    databaseUrlLength: databaseUrl ? databaseUrl.length : 0,
    databaseUrlStartsWith: databaseUrl ? databaseUrl.substring(0, 10) : 'N/A',
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('DB')),
  });
}
