import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const adminCount = await prisma.admin.count();
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      adminCount,
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: error.message,
      code: error.code,
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      nodeEnv: process.env.NODE_ENV,
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
