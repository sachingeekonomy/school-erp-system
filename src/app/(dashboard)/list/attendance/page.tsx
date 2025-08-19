import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import SortDropdown from "@/components/SortDropdown";
import FilterDropdown from "@/components/FilterDropdown";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { getUserRoleSync } from "@/lib/getUserRole";
import { getUserSession } from "@/lib/auth";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type AttendanceList = {
  id: number;
  studentId: string;
  studentName: string;
  studentSurname: string;
  lessonId: number;
  lessonName: string;
  lessonDay: string;
  present: boolean;
  className: string;
  teacherName: string;
  teacherSurname: string;
  date: Date;
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Get user role using the new robust function
  const role = await getUserRoleSync();
  
  // Still need userId for role-based filtering
  const session = await getUserSession();
  const currentUserId = session?.id;

  console.log("User role determined:", role);

  const columns = [
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Lesson",
      accessor: "lesson",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden lg:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden lg:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: AttendanceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <span className="font-medium">{item.studentName + " " + item.studentSurname}</span>
          <span className="text-xs text-gray-500">{item.className}</span>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex flex-col">
          <span className="font-medium">{item.lessonName}</span>
          <span className="text-xs text-gray-500">{item.lessonDay}</span>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
          item.present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {item.present ? "Present" : "Absent"}
        </div>
      </td>
      <td className="hidden lg:table-cell">
        {item.teacherName + " " + item.teacherSurname}
      </td>
      <td className="hidden lg:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US", { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(item.date)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.AttendanceWhereInput = {};

  // Handle sorting
  let orderBy: any = { id: 'desc' }; // Default sorting
  
  const { sort, order } = queryParams;
  if (sort && order) {
    switch (sort) {
      case 'date':
        orderBy = { date: order };
        break;
      case 'student':
        orderBy = { student: { name: order } };
        break;
      case 'lesson':
        orderBy = { lesson: { name: order } };
        break;
      case 'present':
        orderBy = { present: order };
        break;
      case 'class':
        orderBy = { student: { class: { name: order } } };
        break;
      case 'teacher':
        orderBy = { lesson: { teacher: { name: order } } };
        break;
      default:
        orderBy = { id: order };
        break;
    }
  }

  // Handle filters and search
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "lessonId":
            query.lessonId = parseInt(value);
            break;
          case "classId":
            query.student = {
              classId: parseInt(value)
            };
            break;
          case "teacherId":
            query.lesson = {
              teacherId: value
            };
            break;
          case "present":
            query.present = value === "true";
            break;
          case "search":
            query.OR = [
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { surname: { contains: value, mode: "insensitive" } } },
              { lesson: { name: { contains: value, mode: "insensitive" } } },
              { student: { class: { name: { contains: value, mode: "insensitive" } } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS

  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson = {
        teacherId: currentUserId!,
      };
      break;
    case "student":
      query.studentId = currentUserId!;
      break;
    case "parent":
      query.student = {
        parentId: currentUserId!,
      };
      break;
    default:
      break;
  }

  const [dataRes, count, students, lessons, classes, teachers] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: { 
          select: { 
            id: true,
            name: true, 
            surname: true,
            class: { select: { name: true } }
          } 
        },
        lesson: {
          select: {
            id: true,
            name: true,
            day: true,
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy,
    }),
    prisma.attendance.count({ where: query }),
    prisma.student.findMany({
      include: { class: true },
      orderBy: { name: 'asc' },
    }),
    prisma.lesson.findMany({
      include: { 
        teacher: true,
        class: true,
        subject: true
      },
      orderBy: { name: 'asc' },
    }),
    prisma.class.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.teacher.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  const data = dataRes.map((item) => ({
    id: item.id,
    studentId: item.student.id,
    studentName: item.student.name,
    studentSurname: item.student.surname,
    lessonId: item.lesson.id,
    lessonName: item.lesson.name,
    lessonDay: item.lesson.day,
    present: item.present,
    className: item.student.class.name,
    teacherName: item.lesson.teacher.name,
    teacherSurname: item.lesson.teacher.surname,
    date: item.date || new Date(),
  }));

  // Sort options for attendance
  const sortOptions = [
    { value: "date-asc", label: "Date (Oldest First)", field: "date", direction: "asc" as const },
    { value: "date-desc", label: "Date (Newest First)", field: "date", direction: "desc" as const },
    { value: "student-asc", label: "Student (A-Z)", field: "student", direction: "asc" as const },
    { value: "student-desc", label: "Student (Z-A)", field: "student", direction: "desc" as const },
    { value: "lesson-asc", label: "Lesson (A-Z)", field: "lesson", direction: "asc" as const },
    { value: "lesson-desc", label: "Lesson (Z-A)", field: "lesson", direction: "desc" as const },
    { value: "present-asc", label: "Status (Absent First)", field: "present", direction: "asc" as const },
    { value: "present-desc", label: "Status (Present First)", field: "present", direction: "desc" as const },
    { value: "class-asc", label: "Class (A-Z)", field: "class", direction: "asc" as const },
    { value: "class-desc", label: "Class (Z-A)", field: "class", direction: "desc" as const },
    { value: "teacher-asc", label: "Teacher (A-Z)", field: "teacher", direction: "asc" as const },
    { value: "teacher-desc", label: "Teacher (Z-A)", field: "teacher", direction: "desc" as const },
  ];

  // Filter options for attendance
  const filterGroups = [
    {
      title: "Student",
      param: "studentId",
      options: students.map(student => ({
        value: student.id,
        label: `${student.name} ${student.surname} - ${student.class.name}`,
        param: "studentId"
      }))
    },
    {
      title: "Lesson",
      param: "lessonId",
      options: lessons.map(lesson => ({
        value: lesson.id.toString(),
        label: `${lesson.name} - ${lesson.subject.name} - ${lesson.class.name}`,
        param: "lessonId"
      }))
    },
    {
      title: "Class",
      param: "classId",
      options: classes.map(cls => ({
        value: cls.id.toString(),
        label: cls.name,
        param: "classId"
      }))
    },
    {
      title: "Teacher",
      param: "teacherId",
      options: teachers.map(teacher => ({
        value: teacher.id,
        label: `${teacher.name} ${teacher.surname}`,
        param: "teacherId"
      }))
    },
    {
      title: "Status",
      param: "present",
      options: [
        { value: "true", label: "Present", param: "present" },
        { value: "false", label: "Absent", param: "present" }
      ]
    }
  ];

  return (
    <div className="bg-white p-4 flex-1  w-full h-full">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Attendance Records</h1>
        {/* Debug info - remove this after testing */}
       
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FilterDropdown groups={filterGroups} />
            <SortDropdown options={sortOptions} />
            {role === "admin" || role === "teacher" ? (
              <div className="flex items-center gap-2">
                <FormContainer table="attendance" type="create" />
                <span className="text-sm font-medium text-green-600">Click + to add attendance</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm font-medium cursor-not-allowed"
                  disabled
                >
                  Add Attendance (Admin/Teacher Only)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;
