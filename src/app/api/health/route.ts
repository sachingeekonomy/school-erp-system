import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("=== Health Check Started ===");
    
    // Check environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
    };
    
    console.log("Environment check:", envCheck);
    
    // Test database connection
    let dbStatus = "unknown";
    try {
      await prisma.$connect();
      dbStatus = "connected";
      console.log("✅ Database connection successful");
    } catch (dbError) {
      dbStatus = "failed";
      console.error("❌ Database connection failed:", dbError);
    }
    
    // Test basic database operations
    let dbOperations = "unknown";
    try {
      // Test a simple query
      const adminCount = await prisma.admin.count();
      const studentCount = await prisma.student.count();
      const paymentCount = await prisma.payment.count();
      
      dbOperations = "working";
      console.log("✅ Database operations successful");
      console.log("Counts:", { adminCount, studentCount, paymentCount });
    } catch (opError) {
      dbOperations = "failed";
      console.error("❌ Database operations failed:", opError);
    }
    
    // Check Prisma client
    let prismaStatus = "unknown";
    try {
      // Test if Prisma client is properly generated
      const models = Object.keys(prisma);
      prismaStatus = "generated";
      console.log("✅ Prisma client models:", models);
    } catch (prismaError) {
      prismaStatus = "failed";
      console.error("❌ Prisma client check failed:", prismaError);
    }
    
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        connection: dbStatus,
        operations: dbOperations,
        prisma: prismaStatus,
      },
    };
    
    console.log("=== Health Check Completed ===");
    console.log("Health status:", healthStatus);
    
    return NextResponse.json(healthStatus);
    
  } catch (error) {
    console.error("=== Health Check Failed ===");
    console.error("Error:", error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting from database:", disconnectError);
    }
  }
}
