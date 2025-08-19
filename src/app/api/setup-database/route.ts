import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Day, UserSex } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting database setup...");
    
    // First, let's check if data already exists
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      return NextResponse.json({
        success: true,
        message: "Database already has data",
        adminCount,
      });
    }

    // Run the seed function directly
    console.log("Running seed function...");
    
    // ADMIN
    await prisma.admin.create({
      data: {
        id: "admin1",
        username: "admin1",
        password: "Dayesh@123",
      },
    });
    await prisma.admin.create({
      data: {
        id: "admin2",
        username: "admin2",
        password: "Dayesh@123",
      },
    });

    // GRADE
    for (let i = 1; i <= 6; i++) {
      await prisma.grade.create({
        data: {
          level: i,
        },
      });
    }

    // CLASS
    for (let i = 1; i <= 6; i++) {
      await prisma.class.create({
        data: {
          name: `${i}A`, 
          gradeId: i, 
          capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
        },
      });
    }

    // SUBJECT
    const subjectData = [
      { name: "Mathematics" },
      { name: "Science" },
      { name: "English" },
      { name: "History" },
      { name: "Geography" },
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Biology" },
      { name: "Computer Science" },
      { name: "Art" },
    ];

    for (const subject of subjectData) {
      await prisma.subject.create({ data: subject });
    }

    // TEACHER
    for (let i = 1; i <= 15; i++) {
      await prisma.teacher.create({
        data: {
          id: `teacher${i}`,
          username: `teacher${i}`,
          password: "Dayesh@123",
          name: `TName${i}`,
          surname: `TSurname${i}`,
          email: `teacher${i}@gamil.com`,
          phone: `776056306${i}`,
          address: `Address${i}`,
          bloodType: "A+",
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          subjects: { connect: [{ id: (i % 10) + 1 }] }, 
          classes: { connect: [{ id: (i % 6) + 1 }] }, 
          birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
        },
      });
    }

    // PARENT
    for (let i = 1; i <= 25; i++) {
      await prisma.parent.create({
        data: {
          id: `parentId${i}`,
          username: `parentId${i}`,
          password: "Dayesh@123",
          name: `PName ${i}`,
          surname: `PSurname ${i}`,
          email: `parent${i}@example.com`,
          phone: `123-456-789${i}`,
          address: `Address${i}`,
        },
      });
    }

    // STUDENT
    for (let i = 1; i <= 50; i++) {
      await prisma.student.create({
        data: {
          id: `student${i}`, 
          username: `student${i}`, 
          password: "Dayesh@123",
          name: `SName${i}`,
          surname: `SSurname ${i}`,
          email: `student${i}@example.com`,
          phone: `987-654-321${i}`,
          address: `Address${i}`,
          bloodType: "O-",
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`, 
          gradeId: (i % 6) + 1, 
          classId: (i % 6) + 1, 
          birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
        },
      }); 
    }

    // LESSON
    for (let i = 1; i <= 30; i++) {
      await prisma.lesson.create({
        data: {
          name: `Lesson${i}`, 
          day: Day[
            Object.keys(Day)[
              Math.floor(Math.random() * Object.keys(Day).length)
            ] as keyof typeof Day
          ], 
          startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
          endTime: new Date(new Date().setHours(new Date().getHours() + 3)), 
          subjectId: (i % 10) + 1, 
          classId: (i % 6) + 1, 
          teacherId: `teacher${(i % 15) + 1}`, 
        },
      });
    }

    // EXAM
    for (let i = 1; i <= 10; i++) {
      await prisma.exam.create({
        data: {
          title: `Exam ${i}`, 
          startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
          endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
          lessonId: (i % 30) + 1, 
        },
      });
    }

    // ASSIGNMENT
    for (let i = 1; i <= 10; i++) {
      await prisma.assignment.create({
        data: {
          title: `Assignment ${i}`, 
          startDate: new Date(new Date().setHours(new Date().getHours() + 1)), 
          dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
          lessonId: (i % 30) + 1, 
        },
      });
    }

    // RESULT
    for (let i = 1; i <= 10; i++) {
      await prisma.result.create({
        data: {
          score: 90, 
          studentId: `student${i}`, 
          ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }), 
        },
      });
    }

    // ATTENDANCE
    for (let i = 1; i <= 10; i++) {
      await prisma.attendance.create({
        data: {
          date: new Date(), 
          present: true, 
          studentId: `student${i}`, 
          lessonId: (i % 30) + 1, 
        },
      });
    }

    // EVENT
    for (let i = 1; i <= 5; i++) {
      await prisma.event.create({
        data: {
          title: `Event ${i}`, 
          description: `Description for Event ${i}`, 
          startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
          endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
          classId: (i % 5) + 1, 
        },
      });
    }

    // ANNOUNCEMENT
    for (let i = 1; i <= 5; i++) {
      await prisma.announcement.create({
        data: {
          title: `Announcement ${i}`, 
          description: `Description for Announcement ${i}`, 
          date: new Date(), 
          classId: (i % 5) + 1, 
        },
      });
    }

    // Verify the setup
    const finalAdminCount = await prisma.admin.count();
    const studentCount = await prisma.student.count();
    const teacherCount = await prisma.teacher.count();
    
    console.log("Database setup completed successfully.");
    
    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
      counts: {
        admins: finalAdminCount,
        students: studentCount,
        teachers: teacherCount,
      },
    });
    
  } catch (error: any) {
    console.error("Database setup error:", error);
    return NextResponse.json({
      success: false,
      message: "Database setup failed",
      error: error.message,
    }, { status: 500 });
  }
}
