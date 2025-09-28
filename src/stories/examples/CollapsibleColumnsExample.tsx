import { SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to CollapsibleColumnsExample
export const collapsibleColumnsExampleDefaults = {
  columnResizing: true,
  editColumns: true,
  selectableCells: true,
  columnReordering: true,
  height: "400px",
};

const CollapsibleColumnsExample = (props: UniversalTableProps) => {
  // Sample data showcasing different scenarios for collapsible columns
  const rows = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      email: "john@example.com",
      phone: "+1-555-0101",
      // Contact Info
      address: "123 Main St",
      city: "New York",
      zipCode: "10001",
      // Work Details
      role: "Senior Developer",
      department: "Engineering",
      salary: 95000,
      startDate: "2020-01-15",
      // Performance Metrics
      projectsCompleted: 23,
      efficiency: 94.2,
      satisfaction: 4.8,
      // Skills Assessment
      technical: 9.1,
      communication: 8.7,
      leadership: 7.9,
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      email: "jane@example.com",
      phone: "+1-555-0102",
      // Contact Info
      address: "456 Oak Ave",
      city: "San Francisco",
      zipCode: "94102",
      // Work Details
      role: "UX Designer",
      department: "Design",
      salary: 88000,
      startDate: "2019-03-20",
      // Performance Metrics
      projectsCompleted: 31,
      efficiency: 96.8,
      satisfaction: 4.9,
      // Skills Assessment
      technical: 8.4,
      communication: 9.3,
      leadership: 8.8,
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 45,
      email: "bob@example.com",
      phone: "+1-555-0103",
      // Contact Info
      address: "789 Pine Rd",
      city: "Austin",
      zipCode: "73301",
      // Work Details
      role: "Engineering Manager",
      department: "Engineering",
      salary: 125000,
      startDate: "2018-07-10",
      // Performance Metrics
      projectsCompleted: 18,
      efficiency: 91.5,
      satisfaction: 4.6,
      // Skills Assessment
      technical: 8.9,
      communication: 9.5,
      leadership: 9.2,
    },
    {
      id: 4,
      name: "Alice Williams",
      age: 24,
      email: "alice@example.com",
      phone: "+1-555-0104",
      // Contact Info
      address: "321 Elm St",
      city: "Portland",
      zipCode: "97201",
      // Work Details
      role: "Junior Developer",
      department: "Engineering",
      salary: 72000,
      startDate: "2022-09-01",
      // Performance Metrics
      projectsCompleted: 8,
      efficiency: 87.3,
      satisfaction: 4.7,
      // Skills Assessment
      technical: 7.8,
      communication: 8.2,
      leadership: 6.5,
    },
    {
      id: 5,
      name: "Charlie Brown",
      age: 37,
      email: "charlie@example.com",
      phone: "+1-555-0105",
      // Contact Info
      address: "654 Maple Dr",
      city: "Seattle",
      zipCode: "98101",
      // Work Details
      role: "DevOps Engineer",
      department: "Engineering",
      salary: 102000,
      startDate: "2020-11-12",
      // Performance Metrics
      projectsCompleted: 15,
      efficiency: 93.7,
      satisfaction: 4.5,
      // Skills Assessment
      technical: 9.4,
      communication: 8.1,
      leadership: 7.6,
    },
  ];

  // Define headers with various collapsible scenarios
  const headers: HeaderObject[] = [
    {
      accessor: "id",
      label: "ID",
      width: 60,
      isSortable: true,
      filterable: true,
    },
    {
      accessor: "name",
      label: "Name",
      minWidth: 120,
      width: "1fr",
      isSortable: true,
      filterable: true,
    },

    // Scenario 1: Basic Info (one column visible when collapsed)
    {
      accessor: "basicInfo",
      label: "Basic Info",
      width: 300,
      collapsible: true,
      children: [
        {
          accessor: "age",
          label: "Age",
          width: 80,
          isSortable: true,
          filterable: true,
          visibleWhenCollapsed: true, // This shows when collapsed
          type: "number",
        },
        {
          accessor: "email",
          label: "Email",
          width: 200,
          isSortable: true,
          filterable: true,
          type: "string",
        },
        {
          accessor: "phone",
          label: "Phone",
          width: 140,
          isSortable: true,
          filterable: true,
          type: "string",
        },
      ],
    },

    // Scenario 2: Contact Details (multiple columns visible when collapsed)
    {
      accessor: "contactDetails",
      label: "Contact Details",
      width: 400,
      collapsible: true,
      children: [
        {
          accessor: "address",
          label: "Address",
          width: 180,
          visibleWhenCollapsed: true, // Visible when collapsed
          filterable: true,
          type: "string",
        },
        {
          accessor: "city",
          label: "City",
          width: 120,
          visibleWhenCollapsed: true, // Visible when collapsed
          isSortable: true,
          filterable: true,
          type: "string",
        },
        {
          accessor: "zipCode",
          label: "Zip Code",
          width: 100,
          filterable: true,
          type: "string",
        },
      ],
    },

    // Scenario 3: Work Info (no columns visible when collapsed - fully collapses)
    {
      accessor: "workInfo",
      label: "Work Information",
      width: 500,
      collapsible: true,
      children: [
        {
          accessor: "role",
          label: "Role",
          width: 160,
          isSortable: true,
          filterable: true,
          type: "string",
        },
        {
          accessor: "department",
          label: "Department",
          width: 120,
          isSortable: true,
          filterable: true,
          type: "string",
        },
        {
          accessor: "salary",
          label: "Salary",
          width: 120,
          isSortable: true,
          filterable: true,
          align: "right",
          type: "number",
          cellRenderer: ({ row }) => {
            return `$${(row.salary as number).toLocaleString()}`;
          },
        },
        {
          accessor: "startDate",
          label: "Start Date",
          width: 120,
          isSortable: true,
          filterable: true,
          type: "date",
        },
      ],
    },

    // Scenario 4: Performance (first column visible when collapsed)
    {
      accessor: "performance",
      label: "Performance Metrics",
      width: 360,
      collapsible: true,
      children: [
        {
          accessor: "projectsCompleted",
          label: "Projects",
          width: 100,
          visibleWhenCollapsed: true, // Shows key metric when collapsed
          isSortable: true,
          filterable: true,
          align: "center",
          type: "number",
        },
        {
          accessor: "efficiency",
          label: "Efficiency %",
          width: 120,
          isSortable: true,
          filterable: true,
          align: "right",
          type: "number",
          cellRenderer: ({ row }) => {
            const value = row.efficiency as number;
            const color =
              value >= 95 ? "text-green-600" : value >= 90 ? "text-yellow-600" : "text-red-600";
            return <span className={color}>{value.toFixed(1)}%</span>;
          },
        },
        {
          accessor: "satisfaction",
          label: "Satisfaction",
          width: 120,
          isSortable: true,
          filterable: true,
          align: "right",
          type: "number",
          cellRenderer: ({ row }) => {
            const value = row.satisfaction as number;
            return `${value.toFixed(1)}/5.0`;
          },
        },
      ],
    },

    // Scenario 5: Skills (all columns visible when collapsed)
    {
      accessor: "skills",
      label: "Skills Assessment",
      width: 300,
      collapsible: true,
      children: [
        {
          accessor: "technical",
          label: "Technical",
          width: 100,
          visibleWhenCollapsed: true,
          isSortable: true,
          filterable: true,
          align: "center",
          type: "number",
          cellRenderer: ({ row }) => {
            return (row.technical as number).toFixed(1);
          },
        },
        {
          accessor: "communication",
          label: "Communication",
          width: 120,
          visibleWhenCollapsed: true,
          isSortable: true,
          filterable: true,
          align: "center",
          type: "number",
          cellRenderer: ({ row }) => {
            return (row.communication as number).toFixed(1);
          },
        },
        {
          accessor: "leadership",
          label: "Leadership",
          width: 100,
          visibleWhenCollapsed: true,
          isSortable: true,
          filterable: true,
          align: "center",
          type: "number",
          cellRenderer: ({ row }) => {
            return (row.leadership as number).toFixed(1);
          },
        },
      ],
    },
  ];

  return (
    <div>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          margin: "1rem 0",
          border: "1px solid #e9ecef",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>🔄 Collapsible Columns Demo</h3>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6c757d" }}>
          Click the <strong>◀</strong> arrow icons in headers to collapse column groups. Different
          groups show different behaviors when collapsed:
        </p>
        <ul style={{ margin: "0.5rem 0 0 1rem", fontSize: "0.85rem", color: "#6c757d" }}>
          <li>
            <strong>Basic Info:</strong> Shows Age only when collapsed
          </li>
          <li>
            <strong>Contact Details:</strong> Shows Address & City when collapsed
          </li>
          <li>
            <strong>Work Information:</strong> Fully collapses (no columns visible)
          </li>
          <li>
            <strong>Performance:</strong> Shows Projects count when collapsed
          </li>
          <li>
            <strong>Skills:</strong> Shows all skill ratings when collapsed
          </li>
        </ul>
      </div>

      <SimpleTable {...props} defaultHeaders={headers} rows={rows} rowIdAccessor="id" />
    </div>
  );
};

export default CollapsibleColumnsExample;
