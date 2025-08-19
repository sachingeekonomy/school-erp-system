import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import SortDropdown from "@/components/SortDropdown";
import FilterDropdown from "@/components/FilterDropdown";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Result, Class, Prisma, Subject, Student, Teacher } from "@prisma/client";
import Image from "next/image";

import { getUserRoleSync } from "@/lib/getUserRole";
import { getUserSession } from "@/lib/auth";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
  originalData: any; // Original database result data
};


const ResultListPage = async ({
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
    header: "Title",
    accessor: "title",
  },
  {
    header: "Student",
    accessor: "student",
  },
  {
    header: "Score",
    accessor: "score",
    className: "hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
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

const renderRow = (item: ResultList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.title}</h3>
      </div>
    </td>
    <td>
      <div className="flex flex-col">
        <span className="font-medium">{item.studentName + " " + item.studentSurname}</span>
        <span className="text-xs text-gray-500">{item.className}</span>
      </div>
    </td>
    <td className="hidden md:table-cell">
      <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
        item.score >= 80 ? 'bg-green-100 text-green-700' :
        item.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {item.score}%
      </div>
    </td>
    <td className="hidden md:table-cell">
      {item.teacherName + " " + item.teacherSurname}
    </td>
    <td className="hidden md:table-cell">{item.className}</td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US", { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(item.startTime)}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher") && (
          <>
            <FormContainer table="result" type="update" data={item.originalData} />
            <FormContainer table="result" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ResultWhereInput = {};

  // Handle sorting
  let orderBy: any = { id: 'asc' }; // Default sorting
  
  const { sort, order } = queryParams;
  if (sort && order) {
    switch (sort) {
      case 'score':
        orderBy = { score: order };
        break;
      case 'student':
        orderBy = { student: { name: order } };
        break;
      case 'exam':
        orderBy = { exam: { title: order } };
        break;
      case 'assignment':
        orderBy = { assignment: { title: order } };
        break;
      case 'class':
        orderBy = { 
          OR: [
            { exam: { lesson: { class: { name: order } } } },
            { assignment: { lesson: { class: { name: order } } } }
          ]
        };
        break;
      case 'teacher':
        orderBy = { 
          OR: [
            { exam: { lesson: { teacher: { name: order } } } },
            { assignment: { lesson: { teacher: { name: order } } } }
          ]
        };
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
          case "classId":
            query.OR = [
              { exam: { lesson: { classId: parseInt(value) } } },
              { assignment: { lesson: { classId: parseInt(value) } } }
            ];
            break;
          case "teacherId":
            query.OR = [
              { exam: { lesson: { teacherId: value } } },
              { assignment: { lesson: { teacherId: value } } }
            ];
            break;
          case "assessmentType":
            if (value === "exam") {
              query.examId = { not: null };
            } else if (value === "assignment") {
              query.assignmentId = { not: null };
            }
            break;
          case "search":
            query.OR = [
              { exam: { title: { contains: value, mode: "insensitive" } } },
              { assignment: { title: { contains: value, mode: "insensitive" } } },
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { surname: { contains: value, mode: "insensitive" } } },
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
      query.OR = [
        { exam: { lesson: { teacherId: currentUserId! } } },
        { assignment: { lesson: { teacherId: currentUserId! } } },
      ];
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

  const [dataRes, count, students, classes, teachers] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
    prisma.student.findMany({
      include: { class: true },
      orderBy: { name: 'asc' },
    }),
    prisma.class.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.teacher.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  const data = dataRes.map((item) => {
    const assessment = item.exam || item.assignment;

    if (!assessment) return null;

    const isExam = "startTime" in assessment;

    return {
      id: item.id,
      title: assessment.title,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
      originalData: item, // Include the original database data
    };
  });

  // Filter out null values
  const filteredData = data.filter(item => item !== null);

  // Sort options for results
  const sortOptions = [
    { value: "score-asc", label: "Score (Low to High)", field: "score", direction: "asc" as const },
    { value: "score-desc", label: "Score (High to Low)", field: "score", direction: "desc" as const },
    { value: "student-asc", label: "Student (A-Z)", field: "student", direction: "asc" as const },
    { value: "student-desc", label: "Student (Z-A)", field: "student", direction: "desc" as const },
    { value: "exam-asc", label: "Exam (A-Z)", field: "exam", direction: "asc" as const },
    { value: "exam-desc", label: "Exam (Z-A)", field: "exam", direction: "desc" as const },
    { value: "assignment-asc", label: "Assignment (A-Z)", field: "assignment", direction: "asc" as const },
    { value: "assignment-desc", label: "Assignment (Z-A)", field: "assignment", direction: "desc" as const },
    { value: "class-asc", label: "Class (A-Z)", field: "class", direction: "asc" as const },
    { value: "class-desc", label: "Class (Z-A)", field: "class", direction: "desc" as const },
    { value: "teacher-asc", label: "Teacher (A-Z)", field: "teacher", direction: "asc" as const },
    { value: "teacher-desc", label: "Teacher (Z-A)", field: "teacher", direction: "desc" as const },
  ];

  // Filter options for results
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
      title: "Assessment Type",
      param: "assessmentType",
      options: [
        { value: "exam", label: "Exams Only", param: "assessmentType" },
        { value: "assignment", label: "Assignments Only", param: "assessmentType" }
      ]
    }
  ];

  return (
    <div className="bg-white p-4 flex-1  w-full h-full">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        {/* Debug info - remove this after testing */}
       
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FilterDropdown groups={filterGroups} />
            <SortDropdown options={sortOptions} />
            {role === "admin" || role === "teacher" ? (
              <div className="flex items-center gap-2">
                <FormContainer table="result" type="create" />
                <span className="text-sm font-medium text-green-600">Click + to add result</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm font-medium cursor-not-allowed"
                  disabled
                >
                  Add Result (Admin/Teacher Only)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResultListPage;
