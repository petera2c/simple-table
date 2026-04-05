// Self-contained demo table setup for this example.
import type { HeaderObject, Row } from "simple-table-core";


export type ProjectTask = {
  id: number;
  task: string;
  assignee: string;
  priority: string;
  status: string;
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
  details: string;
};

export const STATUSES = ["Not Started", "In Progress", "Completed"];

export const cellClickingData: ProjectTask[] = [
  { id: 1001, task: "Design login page mockups", assignee: "Sarah Chen", priority: "High", status: "In Progress", dueDate: "2024-02-15", estimatedHours: 8, completedHours: 5, details: "Create responsive login page designs with modern UI patterns" },
  { id: 1002, task: "Implement user authentication API", assignee: "Marcus Rodriguez", priority: "High", status: "Not Started", dueDate: "2024-02-20", estimatedHours: 16, completedHours: 0, details: "Build secure JWT-based authentication system with OAuth integration" },
  { id: 1003, task: "Write unit tests for payment module", assignee: "Luna Martinez", priority: "Medium", status: "Completed", dueDate: "2024-02-10", estimatedHours: 12, completedHours: 12, details: "Comprehensive test coverage for payment processing functionality" },
  { id: 1004, task: "Update documentation for API endpoints", assignee: "Kai Thompson", priority: "Low", status: "In Progress", dueDate: "2024-02-25", estimatedHours: 6, completedHours: 3, details: "Update Swagger documentation and add usage examples" },
  { id: 1005, task: "Performance optimization for dashboard", assignee: "Zara Kim", priority: "Medium", status: "Not Started", dueDate: "2024-03-01", estimatedHours: 20, completedHours: 0, details: "Optimize rendering performance and implement lazy loading" },
  { id: 1006, task: "Mobile responsiveness testing", assignee: "Tyler Anderson", priority: "High", status: "In Progress", dueDate: "2024-02-18", estimatedHours: 10, completedHours: 7, details: "Test application across various mobile devices and screen sizes" },
  { id: 1007, task: "Setup CI/CD pipeline", assignee: "Phoenix Lee", priority: "Medium", status: "Completed", dueDate: "2024-02-08", estimatedHours: 14, completedHours: 14, details: "Automated testing and deployment pipeline using GitHub Actions" },
  { id: 1008, task: "Database migration scripts", assignee: "River Jackson", priority: "Low", status: "Not Started", dueDate: "2024-02-28", estimatedHours: 8, completedHours: 0, details: "Create migration scripts for database schema updates" },
];

export const cellClickingHeaders: HeaderObject[] = [
  { accessor: "id", label: "Task ID", width: 80, isSortable: true, type: "number" },
  { accessor: "task", label: "Task Name", minWidth: 150, width: "1fr", isSortable: true, type: "string" },
  { accessor: "assignee", label: "Assignee", width: 120, isSortable: true, type: "string" },
  { accessor: "priority", label: "Priority", width: 100, isSortable: true, type: "string" },
  { accessor: "status", label: "Status", width: 120, isSortable: true, type: "string" },
  { accessor: "dueDate", label: "Due Date", width: 120, isSortable: true, type: "date" },
  { accessor: "estimatedHours", label: "Est. Hours", width: 100, isSortable: true, type: "number" },
  { accessor: "completedHours", label: "Done Hours", width: 100, isSortable: true, type: "number" },
  { accessor: "details", label: "View Details", width: 120, type: "other" },
];

export const cellClickingConfig = {
  headers: cellClickingHeaders,
  rows: cellClickingData,
} as const;

export { STATUSES as CELL_CLICKING_STATUSES };
