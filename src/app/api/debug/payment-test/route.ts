import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("=== Payment Debug Test Started ===");
    
    // Test 1: Check environment variables
    console.log("Environment check:");
    console.log("- DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    
    // Test 2: Test database connection
    console.log("Testing database connection...");
    try {
      await prisma.$connect();
      console.log("✅ Database connection successful");
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: dbError },
        { status: 500 }
      );
    }
    
    // Test 3: Test session
    console.log("Testing session...");
    const session = await getUserSession();
    console.log("Session result:", session ? "Found" : "Not found");
    console.log("Session details:", session);
    
    // Test 4: Test student lookup
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") || "student10";
    console.log("Testing student lookup for:", studentId);
    
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          class: {
            select: {
              name: true,
              grade: {
                select: {
                  level: true,
                }
              }
            }
          }
        }
      });
      console.log("Student lookup result:", student ? "Found" : "Not found");
      console.log("Student details:", student);
    } catch (studentError) {
      console.error("❌ Student lookup failed:", studentError);
      return NextResponse.json(
        { error: "Student lookup failed", details: studentError },
        { status: 500 }
      );
    }
    
    // Test 5: Test payment lookup
    console.log("Testing payment lookup...");
    try {
      const payments = await prisma.payment.findMany({
        where: { studentId },
        include: {
          student: {
            select: {
              name: true,
              surname: true,
              email: true,
              img: true,
              class: {
                select: {
                  name: true,
                  grade: {
                    select: {
                      level: true,
                    }
                  }
                }
              }
            }
          }
        },
        take: 5,
        orderBy: {
          dueDate: "asc",
        },
      });
      console.log("Payment lookup result:", payments.length, "payments found");
      console.log("Payment details:", payments);
    } catch (paymentError) {
      console.error("❌ Payment lookup failed:", paymentError);
      return NextResponse.json(
        { error: "Payment lookup failed", details: paymentError },
        { status: 500 }
      );
    }
    
    // Test 6: Test aggregation queries
    console.log("Testing aggregation queries...");
    try {
      const whereClause = { studentId };
      
      const totalAmount = await prisma.payment.aggregate({
        where: whereClause,
        _sum: { amount: true },
      });
      
      const paidAmount = await prisma.payment.aggregate({
        where: { ...whereClause, status: "PAID" },
        _sum: { amount: true },
      });
      
      const pendingAmount = await prisma.payment.aggregate({
        where: { ...whereClause, status: "PENDING" },
        _sum: { amount: true },
      });
      
      const overdueAmount = await prisma.payment.aggregate({
        where: { ...whereClause, status: "OVERDUE" },
        _sum: { amount: true },
      });
      
      console.log("Aggregation results:");
      console.log("- Total amount:", totalAmount._sum.amount);
      console.log("- Paid amount:", paidAmount._sum.amount);
      console.log("- Pending amount:", pendingAmount._sum.amount);
      console.log("- Overdue amount:", overdueAmount._sum.amount);
    } catch (aggError) {
      console.error("❌ Aggregation queries failed:", aggError);
      return NextResponse.json(
        { error: "Aggregation queries failed", details: aggError },
        { status: 500 }
      );
    }
    
    console.log("=== Payment Debug Test Completed Successfully ===");
    
    return NextResponse.json({
      success: true,
      message: "All tests passed",
      session: session ? "Found" : "Not found",
      studentId,
      databaseConnection: "Connected",
    });
    
  } catch (error) {
    console.error("=== Payment Debug Test Failed ===");
    console.error("Error:", error);
    
    return NextResponse.json(
      { 
        error: "Debug test failed", 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
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
