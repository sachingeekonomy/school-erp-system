const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting comprehensive database seeding...");

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.$transaction([
    prisma.messageRecipient.deleteMany(),
    prisma.message.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.financial.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.event.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.result.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.exam.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.student.deleteMany(),
    prisma.parent.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.class.deleteMany(),
    prisma.grade.deleteMany(),
    prisma.admin.deleteMany(),
    prisma.user.deleteMany(),
  ]);

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
        capacity: 30,
      },
      create: {
        id: i,
        name: classNames[i - 1],
        gradeId: Math.ceil(i / 2),
        capacity: 30,
      },
    });
  }

  // 4. SUBJECT (10 records)
  console.log("Creating subjects...");
  const subjectData = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Science" },
    { id: 3, name: "English" },
    { id: 4, name: "Hindi" },
    { id: 5, name: "Social Studies" },
    { id: 6, name: "Computer Science" },
    { id: 7, name: "Physical Education" },
    { id: 8, name: "Art & Craft" },
    { id: 9, name: "Music" },
    { id: 10, name: "Environmental Studies" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.upsert({
      where: { id: subject.id },
      update: subject,
      create: subject,
    });
  }

  // 5. TEACHER (10 records) - Indian Names
  console.log("Creating teachers...");
  const teacherData = [
    { id: "teacher1", username: "teacher1", name: "Rajesh", surname: "Kumar", email: "rajesh.kumar@school.com", phone: "9876543210", address: "123 MG Road, Bangalore", bloodType: "A+", sex: "MALE" },
    { id: "teacher2", username: "teacher2", name: "Priya", surname: "Sharma", email: "priya.sharma@school.com", phone: "9876543211", address: "456 Indira Nagar, Delhi", bloodType: "B+", sex: "FEMALE" },
    { id: "teacher3", username: "teacher3", name: "Amit", surname: "Patel", email: "amit.patel@school.com", phone: "9876543212", address: "789 Andheri West, Mumbai", bloodType: "O+", sex: "MALE" },
    { id: "teacher4", username: "teacher4", name: "Neha", surname: "Singh", email: "neha.singh@school.com", phone: "9876543213", address: "321 Koramangala, Bangalore", bloodType: "AB+", sex: "FEMALE" },
    { id: "teacher5", username: "teacher5", name: "Vikram", surname: "Malhotra", email: "vikram.malhotra@school.com", phone: "9876543214", address: "654 Bandra East, Mumbai", bloodType: "A-", sex: "MALE" },
    { id: "teacher6", username: "teacher6", name: "Anjali", surname: "Gupta", email: "anjali.gupta@school.com", phone: "9876543215", address: "987 Defence Colony, Delhi", bloodType: "B-", sex: "FEMALE" },
    { id: "teacher7", username: "teacher7", name: "Suresh", surname: "Reddy", email: "suresh.reddy@school.com", phone: "9876543216", address: "147 Banjara Hills, Hyderabad", bloodType: "O-", sex: "MALE" },
    { id: "teacher8", username: "teacher8", name: "Kavita", surname: "Verma", email: "kavita.verma@school.com", phone: "9876543217", address: "258 Vasant Vihar, Delhi", bloodType: "AB-", sex: "FEMALE" },
    { id: "teacher9", username: "teacher9", name: "Arun", surname: "Joshi", email: "arun.joshi@school.com", phone: "9876543218", address: "369 JP Nagar, Bangalore", bloodType: "A+", sex: "MALE" },
    { id: "teacher10", username: "teacher10", name: "Meera", surname: "Kapoor", email: "meera.kapoor@school.com", phone: "9876543219", address: "741 Powai, Mumbai", bloodType: "B+", sex: "FEMALE" },
  ];

  for (const teacher of teacherData) {
    await prisma.teacher.upsert({
      where: { id: teacher.id },
      update: {
        ...teacher,
        password: "Dayesh@123",
        subjects: { connect: [{ id: (parseInt(teacher.id.replace('teacher', '')) % 10) + 1 }] },
        classes: { connect: [{ id: (parseInt(teacher.id.replace('teacher', '')) % 10) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 35)),
      },
      create: {
        ...teacher,
        password: "Dayesh@123",
        subjects: { connect: [{ id: (parseInt(teacher.id.replace('teacher', '')) % 10) + 1 }] },
        classes: { connect: [{ id: (parseInt(teacher.id.replace('teacher', '')) % 10) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 35)),
      },
    });
  }

  // 6. PARENT (10 records) - Indian Names
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

  // 7. STUDENT (10 records) - Indian Names
  console.log("Creating students...");
  const studentData = [
    { id: "student1", username: "student1", name: "Aditya", surname: "Kumar", email: "aditya.kumar@student.com", phone: "7654321098", address: "101 MG Road, Bangalore", bloodType: "A+", sex: "MALE", parentId: "parent1", gradeId: 1, classId: 1 },
    { id: "student2", username: "student2", name: "Aisha", surname: "Sharma", email: "aisha.sharma@student.com", phone: "7654321097", address: "102 Indira Nagar, Delhi", bloodType: "B+", sex: "FEMALE", parentId: "parent2", gradeId: 1, classId: 2 },
    { id: "student3", username: "student3", name: "Rahul", surname: "Patel", email: "rahul.patel@student.com", phone: "7654321096", address: "103 Andheri West, Mumbai", bloodType: "O+", sex: "MALE", parentId: "parent3", gradeId: 2, classId: 3 },
    { id: "student4", username: "student4", name: "Zara", surname: "Singh", email: "zara.singh@student.com", phone: "7654321095", address: "104 Koramangala, Bangalore", bloodType: "AB+", sex: "FEMALE", parentId: "parent4", gradeId: 2, classId: 4 },
    { id: "student5", username: "student5", name: "Vivaan", surname: "Malhotra", email: "vivaan.malhotra@student.com", phone: "7654321094", address: "105 Bandra East, Mumbai", bloodType: "A-", sex: "MALE", parentId: "parent5", gradeId: 3, classId: 5 },
    { id: "student6", username: "student6", name: "Diya", surname: "Gupta", email: "diya.gupta@student.com", phone: "7654321093", address: "106 Defence Colony, Delhi", bloodType: "B-", sex: "FEMALE", parentId: "parent6", gradeId: 3, classId: 6 },
    { id: "student7", username: "student7", name: "Arjun", surname: "Reddy", email: "arjun.reddy@student.com", phone: "7654321092", address: "107 Banjara Hills, Hyderabad", bloodType: "O-", sex: "MALE", parentId: "parent7", gradeId: 4, classId: 7 },
    { id: "student8", username: "student8", name: "Kiara", surname: "Verma", email: "kiara.verma@student.com", phone: "7654321091", address: "108 Vasant Vihar, Delhi", bloodType: "AB-", sex: "FEMALE", parentId: "parent8", gradeId: 4, classId: 8 },
    { id: "student9", username: "student9", name: "Shaurya", surname: "Joshi", email: "shaurya.joshi@student.com", phone: "7654321090", address: "109 JP Nagar, Bangalore", bloodType: "A+", sex: "MALE", parentId: "parent9", gradeId: 5, classId: 9 },
    { id: "student10", username: "student10", name: "Anaya", surname: "Kapoor", email: "anaya.kapoor@student.com", phone: "7654321089", address: "110 Powai, Mumbai", bloodType: "B+", sex: "FEMALE", parentId: "parent10", gradeId: 5, classId: 10 },
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
  const lessonDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  const lessonNames = [
    "Mathematics - Algebra Basics",
    "Science - Introduction to Physics",
    "English - Grammar and Composition",
    "Hindi - Vyakaran",
    "Social Studies - Indian History",
    "Computer Science - Programming Basics",
    "Physical Education - Sports Training",
    "Art & Craft - Creative Expression",
    "Music - Classical Indian Music",
    "Environmental Studies - Nature Conservation"
  ];
  
  for (let i = 1; i <= 10; i++) {
    await prisma.lesson.upsert({
      where: { id: i },
      update: {
        name: lessonNames[i - 1],
        day: lessonDays[i - 1],
        startTime: new Date(new Date().setHours(8 + i, 0, 0, 0)),
        endTime: new Date(new Date().setHours(9 + i, 0, 0, 0)),
        subjectId: i,
        classId: i,
        teacherId: `teacher${i}`,
      },
      create: {
        id: i,
        name: lessonNames[i - 1],
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
  const examTitles = [
    "Mathematics Mid-Term Exam",
    "Science Unit Test",
    "English Grammar Test",
    "Hindi Vyakaran Exam",
    "Social Studies Quiz",
    "Computer Science Practical",
    "Physical Education Assessment",
    "Art & Craft Evaluation",
    "Music Theory Test",
    "Environmental Studies Project"
  ];
  
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.upsert({
      where: { id: i },
      update: {
        title: examTitles[i - 1],
        startTime: new Date(new Date().setDate(new Date().getDate() + i)),
        endTime: new Date(new Date().setDate(new Date().getDate() + i + 1)),
        lessonId: i,
      },
      create: {
        id: i,
        title: examTitles[i - 1],
        startTime: new Date(new Date().setDate(new Date().getDate() + i)),
        endTime: new Date(new Date().setDate(new Date().getDate() + i + 1)),
        lessonId: i,
      },
    });
  }

  // 10. ASSIGNMENT (10 records)
  console.log("Creating assignments...");
  const assignmentTitles = [
    "Mathematics Problem Set",
    "Science Lab Report",
    "English Essay Writing",
    "Hindi Story Writing",
    "Social Studies Project",
    "Computer Programming Task",
    "Physical Education Log",
    "Art Portfolio",
    "Music Performance Recording",
    "Environmental Survey Report"
  ];
  
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.upsert({
      where: { id: i },
      update: {
        title: assignmentTitles[i - 1],
        startDate: new Date(new Date().setDate(new Date().getDate() + i)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + i + 7)),
        lessonId: i,
      },
      create: {
        id: i,
        title: assignmentTitles[i - 1],
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
        score: 75 + (i * 3), // Scores from 78 to 102
        studentId: `student${i}`,
        examId: i,
      },
      create: {
        id: i,
        score: 75 + (i * 3),
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
        present: i % 3 !== 0, // Mostly present, some absent
        studentId: `student${i}`,
        lessonId: i,
      },
      create: {
        id: i,
        date: new Date(new Date().setDate(new Date().getDate() - i)),
        present: i % 3 !== 0,
        studentId: `student${i}`,
        lessonId: i,
      },
    });
  }

  // 13. EVENT (10 records)
  console.log("Creating events...");
  const eventTitles = [
    "Annual Sports Day",
    "Science Exhibition",
    "Cultural Fest",
    "Parent-Teacher Meeting",
    "Independence Day Celebration",
    "Republic Day Parade",
    "Children's Day Program",
    "Teacher's Day Celebration",
    "Annual Day Function",
    "Farewell Ceremony"
  ];
  
  const eventDescriptions = [
    "Annual sports competition with various athletic events",
    "Students showcase their science projects and experiments",
    "Cultural performances including dance, music, and drama",
    "Regular meeting between parents and teachers to discuss progress",
    "Celebration of India's independence with cultural programs",
    "Republic Day celebration with flag hoisting and cultural events",
    "Special programs and activities for children",
    "Students honor teachers with cultural programs",
    "Annual celebration with awards and cultural performances",
    "Farewell ceremony for graduating students"
  ];
  
  for (let i = 1; i <= 10; i++) {
    await prisma.event.upsert({
      where: { id: i },
      update: {
        title: eventTitles[i - 1],
        description: eventDescriptions[i - 1],
        startTime: new Date(new Date().setDate(new Date().getDate() + i + 10)),
        endTime: new Date(new Date().setDate(new Date().getDate() + i + 11)),
        classId: i,
      },
      create: {
        id: i,
        title: eventTitles[i - 1],
        description: eventDescriptions[i - 1],
        startTime: new Date(new Date().setDate(new Date().getDate() + i + 10)),
        endTime: new Date(new Date().setDate(new Date().getDate() + i + 11)),
        classId: i,
      },
    });
  }

  // 14. ANNOUNCEMENT (10 records)
  console.log("Creating announcements...");
  const announcementData = [
    {
      id: 1,
      title: "Annual Sports Day 2025",
      description: "Dear students and parents, we are excited to announce our Annual Sports Day will be held on 25th August 2025. All students from classes 1A to 5B are invited to participate. Please collect participation forms from your class teachers.",
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      classId: 1,
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting Schedule",
      description: "Parent-Teacher meetings for all classes will be conducted on 30th August 2025 from 2:00 PM to 5:00 PM. Please book your slots through the school portal. Attendance is mandatory for all parents.",
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      classId: 2,
    },
    {
      id: 3,
      title: "Science Exhibition Registration",
      description: "Interested students can register for the Science Exhibition to be held on 15th September 2025. Projects should be innovative and environmentally friendly. Last date for registration: 5th September.",
      date: new Date(new Date().setDate(new Date().getDate() - 3)),
      classId: 3,
    },
    {
      id: 4,
      title: "Library Week Celebration",
      description: "Library Week will be celebrated from 20th to 26th September 2025. Various activities like book reading, storytelling, and quiz competitions will be organized. Students are encouraged to participate actively.",
      date: new Date(new Date().setDate(new Date().getDate() - 4)),
      classId: 4,
    },
    {
      id: 5,
      title: "Mid-Term Examination Schedule",
      description: "Mid-term examinations will commence from 1st October 2025. Detailed timetable will be shared by class teachers. Students are advised to start their preparations early and maintain regular attendance.",
      date: new Date(new Date().setDate(new Date().getDate() - 5)),
      classId: 5,
    },
    {
      id: 6,
      title: "Cultural Fest 2025",
      description: "Our annual Cultural Fest 'VIBGYOR 2025' will be held on 10th October 2025. Students can participate in dance, music, drama, and art competitions. Registration forms available with respective subject teachers.",
      date: new Date(new Date().setDate(new Date().getDate() - 6)),
      classId: 6,
    },
    {
      id: 7,
      title: "Computer Lab Maintenance",
      description: "Computer Lab will remain closed for maintenance from 12th to 15th October 2025. Computer Science classes will be rescheduled. Students will be informed about the new schedule by their teachers.",
      date: new Date(new Date().setDate(new Date().getDate() - 7)),
      classId: 7,
    },
    {
      id: 8,
      title: "Diwali Holiday Notice",
      description: "School will remain closed for Diwali holidays from 20th to 25th October 2025. Classes will resume on 26th October 2025. Wishing all students and parents a happy and safe Diwali celebration.",
      date: new Date(new Date().setDate(new Date().getDate() - 8)),
      classId: 8,
    },
    {
      id: 9,
      title: "Mathematics Olympiad Registration",
      description: "National Mathematics Olympiad registration is now open. Students from classes 3A to 5B can participate. Exam date: 15th November 2025. Registration fee: ₹500. Contact Mathematics department for details.",
      date: new Date(new Date().setDate(new Date().getDate() - 9)),
      classId: 9,
    },
    {
      id: 10,
      title: "Annual Day Preparations",
      description: "Annual Day celebrations will be held on 20th December 2025. Students are requested to start preparing for cultural performances. Rehearsals will begin from 1st December. Parents are invited to attend the grand celebration.",
      date: new Date(new Date().setDate(new Date().getDate() - 10)),
      classId: 10,
    },
  ];

  for (const announcement of announcementData) {
    await prisma.announcement.upsert({
      where: { id: announcement.id },
      update: announcement,
      create: announcement,
    });
  }

  // 15. PAYMENT (10 records)
  console.log("Creating payments...");
  const paymentTypes = ["TUITION", "EXAM", "TRANSPORT", "LIBRARY", "OTHER"];
  const paymentMethods = ["CASH", "BANK_TRANSFER", "CHECK", "ONLINE"];
  const paymentStatuses = ["PENDING", "PAID", "OVERDUE"];
  
  for (let i = 1; i <= 10; i++) {
    await prisma.payment.upsert({
      where: { id: `payment${i}` },
      update: {
        studentId: `student${i}`,
        amount: 5000 + (i * 500),
        paymentType: paymentTypes[i % 5],
        paymentMethod: paymentMethods[i % 4],
        dueDate: new Date(new Date().setDate(new Date().getDate() + i * 30)),
        description: `Payment for ${paymentTypes[i % 5].toLowerCase()} fees`,
        status: paymentStatuses[i % 3],
      },
      create: {
        id: `payment${i}`,
        studentId: `student${i}`,
        amount: 5000 + (i * 500),
        paymentType: paymentTypes[i % 5],
        paymentMethod: paymentMethods[i % 4],
        dueDate: new Date(new Date().setDate(new Date().getDate() + i * 30)),
        description: `Payment for ${paymentTypes[i % 5].toLowerCase()} fees`,
        status: paymentStatuses[i % 3],
      },
    });
  }

  // 16. USERS (10 records) - For messaging system
  console.log("Creating users for messaging...");
  const userData = [
    { id: "user1", username: "user1", name: "Rajesh", surname: "Kumar", email: "rajesh.kumar@user.com", phone: "9876543201", role: "TEACHER" },
    { id: "user2", username: "user2", name: "Priya", surname: "Sharma", email: "priya.sharma@user.com", phone: "9876543202", role: "TEACHER" },
    { id: "user3", username: "user3", name: "Amit", surname: "Patel", email: "amit.patel@user.com", phone: "9876543203", role: "TEACHER" },
    { id: "user4", username: "user4", name: "Neha", surname: "Singh", email: "neha.singh@user.com", phone: "9876543204", role: "TEACHER" },
    { id: "user5", username: "user5", name: "Vikram", surname: "Malhotra", email: "vikram.malhotra@user.com", phone: "9876543205", role: "TEACHER" },
    { id: "user6", username: "user6", name: "Aditya", surname: "Kumar", email: "aditya.kumar@user.com", phone: "9876543206", role: "STUDENT" },
    { id: "user7", username: "user7", name: "Aisha", surname: "Sharma", email: "aisha.sharma@user.com", phone: "9876543207", role: "STUDENT" },
    { id: "user8", username: "user8", name: "Rahul", surname: "Patel", email: "rahul.patel@user.com", phone: "9876543208", role: "STUDENT" },
    { id: "user9", username: "user9", name: "Zara", surname: "Singh", email: "zara.singh@user.com", phone: "9876543209", role: "STUDENT" },
    { id: "user10", username: "user10", name: "Vivaan", surname: "Malhotra", email: "vivaan.malhotra@user.com", phone: "9876543210", role: "STUDENT" },
  ];

  for (const user of userData) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }

  // 17. MESSAGES (10 records)
  console.log("Creating messages...");
  const messageTitles = [
    "Welcome to New Academic Year",
    "Important Notice for Parents",
    "Exam Schedule Update",
    "Holiday Announcement",
    "Sports Day Information",
    "Library Book Return Reminder",
    "Parent-Teacher Meeting Details",
    "Fee Payment Due Date",
    "Cultural Fest Invitation",
    "Annual Day Celebration"
  ];
  
  const messageContents = [
    "Welcome to the new academic year 2025-26. We hope all students have a successful and enriching year ahead.",
    "This is an important notice for all parents regarding the upcoming parent-teacher meeting scheduled for next week.",
    "There has been a change in the exam schedule. Please check the updated timetable on the school portal.",
    "School will remain closed for the upcoming holiday. Classes will resume on the following working day.",
    "Sports Day is scheduled for next month. All students are encouraged to participate in various events.",
    "Please return all library books before the end of the month. Late returns will incur fines.",
    "Parent-Teacher meeting will be held on Saturday. Please book your appointment slot online.",
    "Fee payment for the current quarter is due by the end of this month. Please ensure timely payment.",
    "You are cordially invited to attend our annual cultural fest. Please join us for an evening of performances.",
    "Annual Day celebration will be held next month. All parents are invited to attend this grand event."
  ];

  for (let i = 1; i <= 10; i++) {
    const message = await prisma.message.upsert({
      where: { id: i },
      update: {
        title: messageTitles[i - 1],
        content: messageContents[i - 1],
        date: new Date(new Date().setDate(new Date().getDate() - i)),
        senderId: `user${i}`,
      },
      create: {
        id: i,
        title: messageTitles[i - 1],
        content: messageContents[i - 1],
        date: new Date(new Date().setDate(new Date().getDate() - i)),
        senderId: `user${i}`,
      },
    });

    // Create message recipients
    await prisma.messageRecipient.upsert({
      where: { id: i },
      update: {
        messageId: i,
        recipientId: `user${Math.min(i + 5, 10)}`, // Use students as recipients, ensure valid ID
        isRead: i % 2 === 0,
        readAt: i % 2 === 0 ? new Date() : null,
      },
      create: {
        id: i,
        messageId: i,
        recipientId: `user${Math.min(i + 5, 10)}`, // Use students as recipients, ensure valid ID
        isRead: i % 2 === 0,
        readAt: i % 2 === 0 ? new Date() : null,
      },
    });
  }

  // 18. FINANCIAL (10 records)
  console.log("Creating financial records...");

  // 18. FINANCIAL (10 records)
  console.log("Creating financial records...");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"];
  
  for (let i = 1; i <= 10; i++) {
    await prisma.financial.upsert({
      where: { id: i },
      update: {
        month: months[i - 1],
        year: 2025,
        income: 500000 + (i * 50000),
        expense: 300000 + (i * 30000),
        description: `Financial report for ${months[i - 1]} 2025`,
      },
      create: {
        id: i,
        month: months[i - 1],
        year: 2025,
        income: 500000 + (i * 50000),
        expense: 300000 + (i * 30000),
        description: `Financial report for ${months[i - 1]} 2025`,
      },
    });
  }

  console.log("Comprehensive seeding completed successfully!");
  
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
    prisma.payment.count(),
    prisma.message.count(),
    prisma.user.count(),
    prisma.financial.count(),
  ]);

  console.log("\n=== DATABASE SEEDING SUMMARY ===");
  console.log(`✅ Admins: ${counts[0]}`);
  console.log(`✅ Grades: ${counts[1]}`);
  console.log(`✅ Classes: ${counts[2]}`);
  console.log(`✅ Subjects: ${counts[3]}`);
  console.log(`✅ Teachers: ${counts[4]}`);
  console.log(`✅ Parents: ${counts[5]}`);
  console.log(`✅ Students: ${counts[6]}`);
  console.log(`✅ Lessons: ${counts[7]}`);
  console.log(`✅ Exams: ${counts[8]}`);
  console.log(`✅ Assignments: ${counts[9]}`);
  console.log(`✅ Results: ${counts[10]}`);
  console.log(`✅ Attendance: ${counts[11]}`);
  console.log(`✅ Events: ${counts[12]}`);
  console.log(`✅ Announcements: ${counts[13]}`);
  console.log(`✅ Payments: ${counts[14]}`);
  console.log(`✅ Messages: ${counts[15]}`);
  console.log(`✅ Users: ${counts[16]}`);
  console.log(`✅ Financial Records: ${counts[17]}`);
  console.log("\n🎉 All data seeded successfully with proper Indian names and realistic school data!");
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
