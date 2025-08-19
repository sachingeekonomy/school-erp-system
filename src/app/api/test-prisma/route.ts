import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("=== Prisma Test Started ===");
    
    // Test 1: Check if Prisma client is properly imported
    console.log("Prisma client imported successfully");
    console.log("Prisma client type:", typeof prisma);
    
    // Test 2: Check available models
    const models = Object.keys(prisma).filter(key => 
      typeof prisma[key as keyof typeof prisma] === 'object' && 
      prisma[key as keyof typeof prisma] !== null &&
      'findMany' in (prisma[key as keyof typeof prisma] as any)
    );
    console.log("Available Prisma models:", models);
    
    // Test 3: Check if Payment model exists
    const hasPaymentModel = 'payment' in prisma;
    console.log("Payment model exists:", hasPaymentModel);
    
    if (!hasPaymentModel) {
      return NextResponse.json({
        error: "Payment model not found in Prisma client",
        availableModels: models,
      }, { status: 500 });
    }
    
    // Test 4: Test database connection
    try {
      await prisma.$connect();
      console.log("✅ Database connection successful");
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
      return NextResponse.json({
        error: "Database connection failed",
        details: dbError,
      }, { status: 500 });
    }
    
    // Test 5: Test Payment model operations
    try {
      const paymentCount = await prisma.payment.count();
      console.log("Payment count:", paymentCount);
      
      const payments = await prisma.payment.findMany({
        take: 1,
        include: {
          student: {
            select: {
              name: true,
              surname: true,
            }
          }
        }
      });
      console.log("Sample payment:", payments[0] || "No payments found");
      
      return NextResponse.json({
        success: true,
        message: "Prisma client is working correctly",
        paymentCount,
        samplePayment: payments[0] || null,
        availableModels: models,
      });
      
    } catch (paymentError) {
      console.error("❌ Payment model operations failed:", paymentError);
      return NextResponse.json({
        error: "Payment model operations failed",
        details: paymentError,
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("=== Prisma Test Failed ===");
    console.error("Error:", error);
    
    return NextResponse.json({
      error: "Prisma test failed",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting from database:", disconnectError);
    }
  }
}
