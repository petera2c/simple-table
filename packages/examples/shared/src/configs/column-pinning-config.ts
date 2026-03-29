import type { HeaderObject } from "simple-table-core";

export const columnPinningHeaders: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 132, pinned: "left", type: "string" },
  { accessor: "email", label: "Email", width: 220, type: "string" },
  { accessor: "role", label: "Role", width: 150, type: "string" },
  { accessor: "department", label: "Department", width: 150, type: "string" },
  { accessor: "location", label: "Location", width: 150, type: "string" },
  { accessor: "joinDate", label: "Join Date", width: 120, type: "date" },
  { accessor: "salary", label: "Salary", width: 120, align: "right", type: "number" },
  { accessor: "manager", label: "Manager", width: 180, type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
  { accessor: "projects", label: "Projects", width: 100, align: "right", pinned: "right", type: "number" },
];

export const columnPinningData = [
  { id: 1, name: "Zara Nakamura", email: "zara.n@pixelstudio.game", role: "Lead Game Designer", department: "Game Design", location: "Tokyo", joinDate: "2019-03-12", salary: 145000, manager: "Hiroshi Tanaka", status: "Active", projects: 7 },
  { id: 2, name: "Phoenix Rodriguez", email: "phoenix.r@pixelstudio.game", role: "3D Artist", department: "Art & Animation", location: "Montreal", joinDate: "2020-11-08", salary: 98000, manager: "Elena Volkov", status: "Active", projects: 4 },
  { id: 3, name: "Kai Thompson", email: "kai.t@pixelstudio.game", role: "Senior Programmer", department: "Engineering", location: "San Francisco", joinDate: "2018-05-15", salary: 135000, manager: "Nova Singh", status: "Active", projects: 6 },
  { id: 4, name: "Luna Martinez", email: "luna.m@pixelstudio.game", role: "UI/UX Designer", department: "User Experience", location: "Barcelona", joinDate: "2021-08-23", salary: 89000, manager: "River Chen", status: "Active", projects: 3 },
  { id: 5, name: "Atlas Williams", email: "atlas.w@pixelstudio.game", role: "Audio Engineer", department: "Sound Design", location: "Nashville", joinDate: "2020-01-17", salary: 92000, manager: "Echo Davis", status: "Active", projects: 5 },
  { id: 6, name: "Sage Kumar", email: "sage.k@pixelstudio.game", role: "QA Lead", department: "Quality Assurance", location: "Bangalore", joinDate: "2019-09-30", salary: 78000, manager: "Orion Lee", status: "Active", projects: 8 },
  { id: 7, name: "River Petrov", email: "river.p@pixelstudio.game", role: "Producer", department: "Production", location: "London", joinDate: "2018-12-05", salary: 125000, manager: "Nova Singh", status: "Active", projects: 4 },
  { id: 8, name: "Nova Hassan", email: "nova.h@pixelstudio.game", role: "Community Manager", department: "Marketing", location: "Los Angeles", joinDate: "2022-04-14", salary: 75000, manager: "Zara Nakamura", status: "Active", projects: 2 },
  { id: 9, name: "Echo Fernandez", email: "echo.f@pixelstudio.game", role: "Narrative Designer", department: "Storytelling", location: "Prague", joinDate: "2021-02-28", salary: 87000, manager: "Atlas Williams", status: "Active", projects: 3 },
  { id: 10, name: "Orion Silva", email: "orion.s@pixelstudio.game", role: "Backend Developer", department: "Engineering", location: "São Paulo", joinDate: "2020-07-11", salary: 101000, manager: "Kai Thompson", status: "Active", projects: 5 },
  { id: 11, name: "Aria Kim", email: "aria.k@pixelstudio.game", role: "Character Artist", department: "Art & Animation", location: "Seoul", joinDate: "2022-01-19", salary: 94000, manager: "Phoenix Rodriguez", status: "Active", projects: 2 },
  { id: 12, name: "Zenith Okafor", email: "zenith.o@pixelstudio.game", role: "Technical Director", department: "Engineering", location: "Stockholm", joinDate: "2017-10-02", salary: 165000, manager: "CEO", status: "Active", projects: 9 },
];

export const columnPinningConfig = {
  headers: columnPinningHeaders,
  rows: columnPinningData,
  tableProps: { columnResizing: true },
} as const;
