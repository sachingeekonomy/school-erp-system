import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data (optional - uncomment if you want to reset)
  // await prisma.$transaction([
  //   prisma.announcement.deleteMany(),
  //   prisma.event.deleteMany(),
  //   prisma.attendance.deleteMany(),
  //   prisma.result.deleteMany(),
  //   prisma.assignment.deleteMany(),
  //   prisma.exam.deleteMany(),
  //   prisma.lesson.deleteMany(),
  //   prisma.student.deleteMany(),
  //   prisma.parent.deleteMany(),
  //   prisma.teacher.deleteMany(),
  //   prisma.subject.deleteMany(),
  //   prisma.class.deleteMany(),
  //   prisma.grade.deleteMany(),
  //   prisma.admin.deleteMany(),
  // ]);

  // 1. ADMIN (10 records)
  console.log("Creating admins...");
  const adminData = [
    { id: "admin1", username: "admin1", password: "Dayesh@123" },
    { id: "admin2", username: "admin2", password: "Dayesh@123" },
    { id: "admin3", username: "admin3", password: "Dayesh@123" },
    { id: "admin4", username: "admin4", password: "Dayesh@123" },
    { id: "admin5", username: "admin5", password: "Dayesh@123" },
    { id: "admin6", username: "admin6", password: "Dayesh@123" },
    { id: "admin7", username: "admin7", password: "Dayesh@123" },
    { id: "admin8", username: "admin8", password: "Dayesh@123" },
    { id: "admin9", username: "admin9", password: "Dayesh@123" },
    { id: "admin10", username: "admin10", password: "Dayesh@123" },
  ];

  for (const admin of adminData) {
    await prisma.admin.upsert({
      where: { id: admin.id },
      update: admin,
      create: admin,
    });
  }

  // 2. GRADE (10 records)
  console.log("Creating grades...");
  for (let i = 1; i <= 10; i++) {
    await prisma.grade.upsert({
      where: { id: i },
      update: { level: i },
      create: { id: i, level: i },
    });
  }

  // 3. CLASS (10 records)
  console.log("Creating classes...");
  const classNames = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B"];
  for (let i = 1; i <= 10; i++) {
    await prisma.class.upsert({
      where: { id: i },
      update: {
        name: classNames[i - 1],
        gradeId: Math.ceil(i / 2),
        capacity: 25,
      },
      create: {
        id: i,
        name: classNames[i - 1],
        gradeId: Math.ceil(i / 2),
        capacity: 25,
      },
    });
  }

  // 4. SUBJECT (10 records)
  console.log("Creating subjects...");
  const subjectData = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Science" },
    { id: 3, name: "English" },
    { id: 4, name: "History" },
    { id: 5, name: "Geography" },
    { id: 6, name: "Physics" },
    { id: 7, name: "Chemistry" },
    { id: 8, name: "Biology" },
    { id: 9, name: "Computer Science" },
    { id: 10, name: "Art" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.upsert({
      where: { id: subject.id },
      update: subject,
      create: subject,
    });
  }

  // 5. TEACHER (10 records)
  console.log("Creating teachers...");
  const teacherData = [
    { id: "teacher1", username: "teacher1", name: "Rajesh", surname: "Kumar", email: "rajesh.kumar@school.com", phone: "9876543210", address: "123 MG Road, Bangalore", bloodType: "A+", sex: UserSex.MALE },
    { id: "teacher2", username: "teacher2", name: "Priya", surname: "Sharma", email: "priya.sharma@school.com", phone: "9876543211", address: "456 Indira Nagar, Delhi", bloodType: "B+", sex: UserSex.FEMALE },
    { id: "teacher3", username: "teacher3", name: "Amit", surname: "Patel", email: "amit.patel@school.com", phone: "9876543212", address: "789 Andheri West, Mumbai", bloodType: "O+", sex: UserSex.MALE },
    { id: "teacher4", username: "teacher4", name: "Neha", surname: "Singh", email: "neha.singh@school.com", phone: "9876543213", address: "321 Koramangala, Bangalore", bloodType: "AB+", sex: UserSex.FEMALE },
    { id: "teacher5", username: "teacher5", name: "Vikram", surname: "Malhotra", email: "vikram.malhotra@school.com", phone: "9876543214", address: "654 Bandra East, Mumbai", bloodType: "A-", sex: UserSex.MALE },
    { id: "teacher6", username: "teacher6", name: "Anjali", surname: "Gupta", email: "anjali.gupta@school.com", phone: "9876543215", address: "987 Defence Colony, Delhi", bloodType: "B-", sex: UserSex.FEMALE },
    { id: "teacher7", username: "teacher7", name: "Suresh", surname: "Reddy", email: "suresh.reddy@school.com", phone: "9876543216", address: "147 Banjara Hills, Hyderabad", bloodType: "O-", sex: UserSex.MALE },
    { id: "teacher8", username: "teacher8", name: "Kavita", surname: "Verma", email: "kavita.verma@school.com", phone: "9876543217", address: "258 Vasant Vihar, Delhi", bloodType: "AB-", sex: UserSex.FEMALE },
    { id: "teacher9", username: "teacher9", name: "Arun", surname: "Joshi", email: "arun.joshi@school.com", phone: "9876543218", address: "369 JP Nagar, Bangalore", bloodType: "A+", sex: UserSex.MALE },
    { id: "teacher10", username: "teacher10", name: "Meera", surname: "Kapoor", email: "meera.kapoor@school.com", phone: "9876543219", address: "741 Powai, Mumbai", bloodType: "B+", sex: UserSex.FEMALE },
  ];

  for (const teacher of teacherData) {
    await prisma.teacher.upsert({
      where: { id: teacher.id },
      update: {
        ...teacher,
        password: "Dayesh@123",
        subjects: { connect: [{ id: (parseInt(teacher.id.replace('teacher', '')) % 10) + 1 }] },
        classes: { connect: [{ id: (parseInt(teacher.id.replace('teacher', '')) % 10) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
      create: {
        ...teacher,
        password: "Dayesh@123",
        subjects: { connect: [{ id: (parseInt(teacher.id.replace('teacher', '')) % 10) + 1 }] },
        classes: { connect: [{ id: (parseInt(teacher.id.replace('teacher', '')) % 10) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
    });
  }

  // 6. PARENT (10 records)
  console.log("Creating parents...");
  const parentData = [
    { id: "parent1", username: "parent1", name: "Ramesh", surname: "Kumar", email: "ramesh.kumar@email.com", phone: "8765432109", address: "100 MG Road, Bangalore" },
    { id: "parent2", username: "parent2", name: "Sunita", surname: "Sharma", email: "sunita.sharma@email.com", phone: "8765432108", address: "200 Indira Nagar, Delhi" },
    { id: "parent3", username: "parent3", name: "Mohan", surname: "Patel", email: "mohan.patel@email.com", phone: "8765432107", address: "300 Andheri West, Mumbai" },
    { id: "parent4", username: "parent4", name: "Reena", surname: "Singh", email: "reena.singh@email.com", phone: "8765432106", address: "400 Koramangala, Bangalore" },
    { id: "parent5", username: "parent5", name: "Sanjay", surname: "Malhotra", email: "sanjay.malhotra@email.com", phone: "8765432105", address: "500 Bandra East, Mumbai" },
    { id: "parent6", username: "parent6", name: "Lakshmi", surname: "Gupta", email: "lakshmi.gupta@email.com", phone: "8765432104", address: "600 Defence Colony, Delhi" },
    { id: "parent7", username: "parent7", name: "Krishna", surname: "Reddy", email: "krishna.reddy@email.com", phone: "8765432103", address: "700 Banjara Hills, Hyderabad" },
    { id: "parent8", username: "parent8", name: "Geeta", surname: "Verma", email: "geeta.verma@email.com", phone: "8765432102", address: "800 Vasant Vihar, Delhi" },
    { id: "parent9", username: "parent9", name: "Prakash", surname: "Joshi", email: "prakash.joshi@email.com", phone: "8765432101", address: "900 JP Nagar, Bangalore" },
    { id: "parent10", username: "parent10", name: "Sita", surname: "Kapoor", email: "sita.kapoor@email.com", phone: "8765432100", address: "1000 Powai, Mumbai" },
  ];

  for (const parent of parentData) {
    await prisma.parent.upsert({
      where: { id: parent.id },
      update: { ...parent, password: "Dayesh@123" },
      create: { ...parent, password: "Dayesh@123" },
    });
  }

  // 7. STUDENT (10 records)
  console.log("Creating students...");
  const studentData = [
    { id: "student1", username: "student1", name: "Aditya", surname: "Kumar", email: "aditya.kumar@student.com", phone: "7654321098", address: "101 MG Road, Bangalore", bloodType: "A+", sex: UserSex.MALE, parentId: "parent1", gradeId: 1, classId: 1 },
    { id: "student2", username: "student2", name: "Aisha", surname: "Sharma", email: "aisha.sharma@student.com", phone: "7654321097", address: "102 Indira Nagar, Delhi", bloodType: "B+", sex: UserSex.FEMALE, parentId: "parent2", gradeId: 1, classId: 2 },
    { id: "student3", username: "student3", name: "Rahul", surname: "Patel", email: "rahul.patel@student.com", phone: "7654321096", address: "103 Andheri West, Mumbai", bloodType: "O+", sex: UserSex.MALE, parentId: "parent3", gradeId: 2, classId: 3 },
    { id: "student4", username: "student4", name: "Zara", surname: "Singh", email: "zara.singh@student.com", phone: "7654321095", address: "104 Koramangala, Bangalore", bloodType: "AB+", sex: UserSex.FEMALE, parentId: "parent4", gradeId: 2, classId: 4 },
    { id: "student5", username: "student5", name: "Vivaan", surname: "Malhotra", email: "vivaan.malhotra@student.com", phone: "7654321094", address: "105 Bandra East, Mumbai", bloodType: "A-", sex: UserSex.MALE, parentId: "parent5", gradeId: 3, classId: 5 },
    { id: "student6", username: "student6", name: "Diya", surname: "Gupta", email: "diya.gupta@student.com", phone: "7654321093", address: "106 Defence Colony, Delhi", bloodType: "B-", sex: UserSex.FEMALE, parentId: "parent6", gradeId: 3, classId: 6 },
    { id: "student7", username: "student7", name: "Arjun", surname: "Reddy", email: "arjun.reddy@student.com", phone: "7654321092", address: "107 Banjara Hills, Hyderabad", bloodType: "O-", sex: UserSex.MALE, parentId: "parent7", gradeId: 4, classId: 7 },
    { id: "student8", username: "student8", name: "Kiara", surname: "Verma", email: "kiara.verma@student.com", phone: "7654321091", address: "108 Vasant Vihar, Delhi", bloodType: "AB-", sex: UserSex.FEMALE, parentId: "parent8", gradeId: 4, classId: 8 },
    { id: "student9", username: "student9", name: "Shaurya", surname: "Joshi", email: "shaurya.joshi@student.com", phone: "7654321090", address: "109 JP Nagar, Bangalore", bloodType: "A+", sex: UserSex.MALE, parentId: "parent9", gradeId: 5, classId: 9 },
    { id: "student10", username: "student10", name: "Anaya", surname: "Kapoor", email: "anaya.kapoor@student.com", phone: "7654321089", address: "110 Powai, Mumbai", bloodType: "B+", sex: UserSex.FEMALE, parentId: "parent10", gradeId: 5, classId: 10 },
  ];

  for (const student of studentData) {
    await prisma.student.upsert({
      where: { id: student.id },
      update: { ...student, password: "Dayesh@123", birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)) },
      create: { ...student, password: "Dayesh@123", birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)) },
    });
  }

  // 8. LESSON (10 records)
  console.log("Creating lessons...");
  const lessonDays = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY];
  for (let i = 1; i <= 10; i++) {
    await prisma.lesson.upsert({
      where: { id: i },
      update: {
        name: `Lesson ${i}`,
        day: lessonDays[i - 1],
        startTime: new Date(new Date().setHours(8 + i, 0, 0, 0)),
        endTime: new Date(new Date().setHours(9 + i, 0, 0, 0)),
        subjectId: i,
        classId: i,
        teacherId: `teacher${i}`,
      },
      create: {
        id: i,
        name: `Lesson ${i}`,
        day: lessonDays[i - 1],
        startTime: new Date(new Date().setHours(8 + i, 0, 0, 0)),
        endTime: new Date(new Date().setHours(9 + i, 0, 0, 0)),
        subjectId: i,
        classId: i,
        teacherId: `teacher${i}`,
      },
    });
  }

  // 9. EXAM (10 records)
  console.log("Creating exams...");
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.upsert({
      where: { id: i },
      update: {
        title: `Exam ${i}`,
        startTime: new Date(new Date().setDate(new Date().getDate() + i)),
        endTime: new Date(new Date().setDate(new Date().getDate() + i + 1)),
        lessonId: i,
      },
      create: {
        id: i,
        title: `Exam ${i}`,
        startTime: new Date(new Date().setDate(new Date().getDate() + i)),
        endTime: new Date(new Date().setDate(new Date().getDate() + i + 1)),
        lessonId: i,
      },
    });
  }

  // 10. ASSIGNMENT (10 records)
  console.log("Creating assignments...");
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.upsert({
      where: { id: i },
      update: {
        title: `Assignment ${i}`,
        startDate: new Date(new Date().setDate(new Date().getDate() + i)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + i + 7)),
        lessonId: i,
      },
      create: {
        id: i,
        title: `Assignment ${i}`,
        startDate: new Date(new Date().setDate(new Date().getDate() + i)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + i + 7)),
        lessonId: i,
      },
    });
  }

  // 11. RESULT (10 records)
  console.log("Creating results...");
  for (let i = 1; i <= 10; i++) {
    await prisma.result.upsert({
      where: { id: i },
      update: {
        score: 85 + (i * 2), // Scores from 87 to 105
        studentId: `student${i}`,
        examId: i,
      },
      create: {
        id: i,
        score: 85 + (i * 2),
        studentId: `student${i}`,
        examId: i,
      },
    });
  }

  // 12. ATTENDANCE (10 records)
  console.log("Creating attendance records...");
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.upsert({
      where: { id: i },
      update: {
        date: new Date(new Date().setDate(new Date().getDate() - i)),
        present: i % 2 === 0, // Alternate present/absent
        studentId: `student${i}`,
        lessonId: i,
      },
      create: {
        id: i,
        date: new Date(new Date().setDate(new Date().getDate() - i)),
        present: i % 2 === 0,
        studentId: `student${i}`,
        lessonId: i,
      },
    });
  }

  // 13. EVENT (10 records)
  console.log("Creating events...");
  for (let i = 1; i <= 10; i++) {
    await prisma.event.upsert({
      where: { id: i },
      update: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startTime: new Date(new Date().setDate(new Date().getDate() + i + 10)),
        endTime: new Date(new Date().setDate(new Date().getDate() + i + 11)),
        classId: i,
      },
      create: {
        id: i,
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startTime: new Date(new Date().setDate(new Date().getDate() + i + 10)),
        endTime: new Date(new Date().setDate(new Date().getDate() + i + 11)),
        classId: i,
      },
    });
  }

  // 14. ANNOUNCEMENT (10 records)
  console.log("Creating announcements...");
  for (let i = 1; i <= 10; i++) {
    await prisma.announcement.upsert({
      where: { id: i },
      update: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i)),
        classId: i,
      },
      create: {
        id: i,
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i)),
        classId: i,
      },
    });
  }

  console.log("Seeding completed successfully!");
  
  // Print summary
  const counts = await prisma.$transaction([
    prisma.admin.count(),
    prisma.grade.count(),
    prisma.class.count(),
    prisma.subject.count(),
    prisma.teacher.count(),
    prisma.parent.count(),
    prisma.student.count(),
    prisma.lesson.count(),
    prisma.exam.count(),
    prisma.assignment.count(),
    prisma.result.count(),
    prisma.attendance.count(),
    prisma.event.count(),
    prisma.announcement.count(),
  ]);

  console.log("Database Summary:");
  console.log(`- Admins: ${counts[0]}`);
  console.log(`- Grades: ${counts[1]}`);
  console.log(`- Classes: ${counts[2]}`);
  console.log(`- Subjects: ${counts[3]}`);
  console.log(`- Teachers: ${counts[4]}`);
  console.log(`- Parents: ${counts[5]}`);
  console.log(`- Students: ${counts[6]}`);
  console.log(`- Lessons: ${counts[7]}`);
  console.log(`- Exams: ${counts[8]}`);
  console.log(`- Assignments: ${counts[9]}`);
  console.log(`- Results: ${counts[10]}`);
  console.log(`- Attendance: ${counts[11]}`);
  console.log(`- Events: ${counts[12]}`);
  console.log(`- Announcements: ${counts[13]}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
