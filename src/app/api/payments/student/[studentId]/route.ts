import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    console.log("=== Payment API Request Started ===");
    console.log("Student ID:", params.studentId);
    console.log("Request URL:", request.url);
    
    // Test database connection first
    try {
      await prisma.$connect();
      console.log("✅ Database connection successful");
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const session = await getUserSession();
    const userId = session?.id;
    console.log("Session user ID:", userId);
    
    if (!userId) {
      console.log("❌ No user session found");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user has permission to view this student's payments
    // Skip User model lookup for now due to schema mismatch
    let canView = false;
    
    // Try legacy system - check if user is a student
    const student = await prisma.student.findUnique({
      where: { id: userId },
    });
    
    if (student) {
      console.log("User found as student in legacy system");
      canView = params.studentId === userId;
    } else {
      // Check if user is a parent
      const parent = await prisma.parent.findUnique({
        where: { id: userId },
      });
      
      if (parent) {
        console.log("User found as parent in legacy system");
        // Check if the student belongs to this parent
        const student = await prisma.student.findFirst({
          where: {
            id: params.studentId,
            parentId: userId,
          },
        });
        canView = !!student;
      } else {
        // Check if user is an admin
        const admin = await prisma.admin.findUnique({
          where: { id: userId },
        });
        
        if (admin) {
          console.log("User found as admin in legacy system");
          canView = true;
        }
      }
    }

    console.log("Permission check result:", canView);

    if (!canView) {
      console.log("❌ User doesn't have permission to view payments");
      return NextResponse.json(
        { error: "You don't have permission to view this student's payments" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    console.log("Query parameters:", { page, limit, status, skip });

    // Build where clause
    const whereClause: any = { studentId: params.studentId };
    if (status) {
      whereClause.status = status;
    }

    console.log("Where clause:", whereClause);

    // Check if student exists first
    const studentExists = await prisma.student.findUnique({
      where: { id: params.studentId },
    });

    if (!studentExists) {
      console.log("❌ Student not found:", params.studentId);
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    console.log("✅ Student found, fetching payments...");

    const payments = await prisma.payment.findMany({
      where: whereClause,
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
      skip,
      take: limit,
      orderBy: {
        dueDate: "asc",
      },
    });

    console.log("Payments fetched:", payments.length);

    const total = await prisma.payment.count({ where: whereClause });
    console.log("Total payments count:", total);

    // Calculate summary statistics
    console.log("Calculating summary statistics...");
    
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

    const summary = {
      totalAmount: totalAmount._sum.amount || 0,
      paidAmount: paidAmount._sum.amount || 0,
      pendingAmount: pendingAmount._sum.amount || 0,
      overdueAmount: overdueAmount._sum.amount || 0,
    };

    console.log("Summary calculated:", summary);
    console.log("=== Payment API Request Completed Successfully ===");

    return NextResponse.json({
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      summary,
    });
  } catch (error) {
    console.error("=== Payment API Request Failed ===");
    console.error("Error details:", error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : undefined);
    
    return NextResponse.json(
      { error: "Failed to fetch payments" },
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
