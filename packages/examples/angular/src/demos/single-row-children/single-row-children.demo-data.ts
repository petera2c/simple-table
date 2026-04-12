// Self-contained demo table setup for this example.
import type { AngularHeaderObject } from "@simple-table/angular";


export const singleRowChildrenData = [
  { id: 1, studentId: "STU-2024-001", studentName: "Alexandra Martinez", gradeLevel: "10th Grade", overallGPA: 3.85, mathGrade: 92, scienceGrade: 88, englishGrade: 91, historyGrade: 89 },
  { id: 2, studentId: "STU-2024-002", studentName: "Benjamin Foster", gradeLevel: "11th Grade", overallGPA: 3.65, mathGrade: 85, scienceGrade: 87, englishGrade: 89, historyGrade: 86 },
  { id: 3, studentId: "STU-2024-003", studentName: "Chloe Nakamura", gradeLevel: "12th Grade", overallGPA: 3.95, mathGrade: 96, scienceGrade: 94, englishGrade: 95, historyGrade: 93 },
  { id: 4, studentId: "STU-2024-004", studentName: "Diego Ramirez", gradeLevel: "9th Grade", overallGPA: 3.45, mathGrade: 82, scienceGrade: 84, englishGrade: 85, historyGrade: 83 },
  { id: 5, studentId: "STU-2024-005", studentName: "Emma Lindberg", gradeLevel: "10th Grade", overallGPA: 3.75, mathGrade: 88, scienceGrade: 90, englishGrade: 92, historyGrade: 87 },
  { id: 6, studentId: "STU-2024-006", studentName: "Finn O'Connor", gradeLevel: "11th Grade", overallGPA: 3.55, mathGrade: 84, scienceGrade: 85, englishGrade: 87, historyGrade: 86 },
  { id: 7, studentId: "STU-2024-007", studentName: "Grace Wellington", gradeLevel: "12th Grade", overallGPA: 4.0, mathGrade: 98, scienceGrade: 97, englishGrade: 99, historyGrade: 98 },
  { id: 8, studentId: "STU-2024-008", studentName: "Hassan Al-Rashid", gradeLevel: "9th Grade", overallGPA: 3.35, mathGrade: 80, scienceGrade: 82, englishGrade: 83, historyGrade: 81 },
  { id: 9, studentId: "STU-2024-009", studentName: "Isabella Kowalski", gradeLevel: "10th Grade", overallGPA: 3.8, mathGrade: 90, scienceGrade: 89, englishGrade: 93, historyGrade: 88 },
  { id: 10, studentId: "STU-2024-010", studentName: "Jackson Mbele", gradeLevel: "11th Grade", overallGPA: 3.7, mathGrade: 87, scienceGrade: 88, englishGrade: 90, historyGrade: 89 },
  { id: 11, studentId: "STU-2024-011", studentName: "Keiko Tanaka", gradeLevel: "12th Grade", overallGPA: 3.9, mathGrade: 94, scienceGrade: 93, englishGrade: 96, historyGrade: 92 },
];

export const singleRowChildrenHeaders: AngularHeaderObject[] = [
  { accessor: "studentId", label: "Student ID", width: 160, isSortable: true, type: "string" },
  { accessor: "gradeLevel", label: "Grade Level", width: 150, isSortable: true, type: "string" },
  {
    accessor: "studentName",
    label: "Student Name",
    width: 200,
    collapsible: true,
    type: "string",
    isSortable: true,
    singleRowChildren: true,
    children: [
      { accessor: "overallGPA", label: "GPA", width: 90, isSortable: true, type: "number", align: "right", showWhen: "parentCollapsed", valueFormatter: ({ value }) => (value as number).toFixed(2) },
      { accessor: "mathGrade", label: "Math", width: 90, isSortable: true, type: "number", align: "right", showWhen: "parentExpanded" },
      { accessor: "scienceGrade", label: "Science", width: 90, isSortable: true, type: "number", align: "right", showWhen: "parentExpanded" },
      { accessor: "englishGrade", label: "English", width: 90, isSortable: true, type: "number", align: "right", showWhen: "parentExpanded" },
      { accessor: "historyGrade", label: "History", width: 90, isSortable: true, type: "number", align: "right", showWhen: "parentExpanded" },
    ],
  },
];

export const singleRowChildrenConfig = {
  headers: singleRowChildrenHeaders,
  rows: singleRowChildrenData,
  tableProps: {
    columnResizing: true,
    selectableCells: true,
  },
} as const;
