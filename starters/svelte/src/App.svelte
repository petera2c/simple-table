<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { SvelteColumnDef } from "@simple-table/svelte";
  import "@simple-table/svelte/styles.css";

  interface Employee {
    id: number;
    name: string;
    age: number;
    role: string;
    department: string;
    startDate: string;
  }

  const columns: SvelteColumnDef<Employee>[] = [
    { accessor: "id", label: "ID", width: 80, sortable: true, type: "number" },
    {
      accessor: "name",
      label: "Name",
      minWidth: 120,
      width: "1fr",
      sortable: true,
      type: "string",
    },
    {
      accessor: "age",
      label: "Age",
      width: 100,
      sortable: true,
      type: "number",
    },
    {
      accessor: "role",
      label: "Role",
      width: 180,
      sortable: true,
      type: "string",
    },
    {
      accessor: "department",
      label: "Department",
      width: 150,
      sortable: true,
      type: "string",
      filterable: true,
    },
    {
      accessor: "startDate",
      label: "Start Date",
      width: 150,
      sortable: true,
      type: "date",
    },
  ];

  const data: Employee[] = [
    {
      id: 1,
      name: "Marcus Rodriguez",
      age: 29,
      role: "Frontend Developer",
      department: "Engineering",
      startDate: "2022-03-15",
    },
    {
      id: 2,
      name: "Sophia Chen",
      age: 27,
      role: "UX/UI Designer",
      department: "Design",
      startDate: "2021-11-08",
    },
    {
      id: 3,
      name: "Raj Patel",
      age: 34,
      role: "Engineering Manager",
      department: "Engineering",
      startDate: "2020-01-20",
    },
    {
      id: 4,
      name: "Luna Martinez",
      age: 23,
      role: "Junior Developer",
      department: "Engineering",
      startDate: "2023-06-12",
    },
    {
      id: 5,
      name: "Tyler Anderson",
      age: 31,
      role: "DevOps Engineer",
      department: "Infrastructure",
      startDate: "2021-08-03",
    },
    {
      id: 6,
      name: "Zara Kim",
      age: 28,
      role: "Product Designer",
      department: "Design",
      startDate: "2022-01-17",
    },
    {
      id: 7,
      name: "Kai Thompson",
      age: 26,
      role: "Full Stack Developer",
      department: "Engineering",
      startDate: "2022-09-05",
    },
    {
      id: 8,
      name: "Ava Singh",
      age: 33,
      role: "Product Manager",
      department: "Product",
      startDate: "2020-07-14",
    },
    {
      id: 9,
      name: "Jordan Walsh",
      age: 25,
      role: "Marketing Specialist",
      department: "Growth",
      startDate: "2023-02-28",
    },
    {
      id: 10,
      name: "Phoenix Lee",
      age: 30,
      role: "Backend Developer",
      department: "Engineering",
      startDate: "2021-05-11",
    },
  ];

  const getRowId = ({ row }: { row: Employee }) => row.id;
</script>

<div style="max-width: 1200px; margin: 0 auto;">
  <h1 style="margin-bottom: 20px; color: #333;">
    Simple Table Svelte Starter
  </h1>
  <p style="margin-bottom: 20px; color: #666;">
    A lightweight data grid with sorting, filtering, and more. Try clicking
    column headers to sort, or use the filter icon in the Department column.
  </p>
  <SimpleTable
    {columns}
    rows={data}
    height="500px"
    enableColumnEditor={true}
    selectableCells={true}
    {getRowId}
  />
</div>
