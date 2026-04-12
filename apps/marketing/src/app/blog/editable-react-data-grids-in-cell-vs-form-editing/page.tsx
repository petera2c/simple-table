import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCheckCircle,
  faLightbulb,
  faCode,
  faExclamationTriangle,
  faRocket,
  faCogs,
  faTable,
  faFileAlt,
  faBalanceScale,
  faKeyboard,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.editableReactDataGrids.title,
  description: SEO_STRINGS.blogPosts.editableReactDataGrids.description,
  keywords: SEO_STRINGS.blogPosts.editableReactDataGrids.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.editableReactDataGrids.title,
    description: SEO_STRINGS.blogPosts.editableReactDataGrids.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.editableReactDataGrids.title,
    description: SEO_STRINGS.blogPosts.editableReactDataGrids.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/editable-react-data-grids-in-cell-vs-form-editing",
  },
};

export default function EditableReactDataGridsPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Editable React Data Grids: In-Cell Editing vs Form-Based Editing (2026)
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faEdit} />
            Editing Patterns
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBalanceScale} />
            Comparison
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Choosing between in-cell editing and form-based editing can make or break your data grid
          UX. Discover when to use each approach, how to implement them in React, and why the right
          choice depends on your users' workflow.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're building a dashboard with an editable data grid. Users need to update
                inventory quantities, modify employee records, or adjust pricing data. The question
                hits you: Should users edit directly in the cells, or click a button to open a form?
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This isn't just a UI preference—it's a fundamental UX decision that affects how
                quickly users can work, how many errors they make, and whether they'll love or hate
                your application. Excel users expect instant in-cell editing. Form-based systems
                feel familiar to anyone who's used a CRM. Both have their place, but choosing wrong
                can frustrate users and slow down critical workflows.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In this guide, we'll break down both approaches, show you when to use each, and
                demonstrate how to implement them in modern{" "}
                <Link
                  href="/blog/best-react-table-libraries-2026"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  React data grid libraries
                </Link>
                . Whether you're building a spreadsheet-like interface or a complex data management
                system, you'll learn which editing pattern fits your use case.
              </p>
            </div>
          </div>
        </section>

        {/* In-Cell Editing Section */}
        <section id="in-cell-editing">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-purple-500" />
              In-Cell Editing: The Spreadsheet Experience
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In-cell editing allows users to modify data directly within table cells, just like
                Excel or Google Sheets. Click a cell, type a new value, press Enter—done. It's the
                fastest way to edit data when users need to make quick, focused changes across
                multiple rows.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                How In-Cell Editing Works
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When a user clicks an editable cell, the table replaces the static display with an
                appropriate editor:
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300 list-disc list-inside">
                <li>
                  <strong>Text fields:</strong> For strings, names, descriptions
                </li>
                <li>
                  <strong>Number inputs:</strong> For quantities, prices, with validation
                </li>
                <li>
                  <strong>Dropdowns:</strong> For status, categories, enums
                </li>
                <li>
                  <strong>Date pickers:</strong> For dates and timestamps
                </li>
                <li>
                  <strong>Checkboxes:</strong> For boolean flags
                </li>
              </ul>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The editor appears inline, preserving the table's layout and context. Users can tab
                between cells, use keyboard shortcuts, and even copy-paste from spreadsheets.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Implementing In-Cell Editing in Simple Table
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table makes in-cell editing incredibly straightforward. Just mark columns as
                editable and handle the changes:
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable, HeaderObject, CellChangeProps } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  lastUpdated: string;
}

const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Product Name",
    type: "string",
    isEditable: true, // Enable editing
    width: 200,
  },
  {
    accessor: "price",
    label: "Price",
    type: "number", // Number editor with validation
    isEditable: true,
    width: 120,
  },
  {
    accessor: "stock",
    label: "Stock",
    type: "number",
    isEditable: true,
    width: 100,
  },
  {
    accessor: "status",
    label: "Status",
    type: "enum", // Dropdown editor
    isEditable: true,
    enumOptions: [
      { label: "In Stock", value: "in_stock" },
      { label: "Low Stock", value: "low_stock" },
      { label: "Out of Stock", value: "out_of_stock" },
    ],
    width: 150,
  },
  {
    accessor: "lastUpdated",
    label: "Last Updated",
    type: "date", // Date picker
    isEditable: true,
    width: 150,
  },
];

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([
    // ... your data
  ]);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    // Update the data immediately
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === row.id
          ? { ...product, [accessor]: newValue }
          : product
      )
    );

    // Optional: Sync to backend
    updateProductAPI(row.id, accessor, newValue);
  };

  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={products}
      
      onCellEdit={handleCellEdit}
      height="600px"
    />
  );
}`}
              />

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  What Happens Behind the Scenes
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                  <li>
                    Simple Table automatically renders the correct editor based on the{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">type</code> property
                  </li>
                  <li>Users can click, double-click, or press Enter to start editing</li>
                  <li>Tab and Shift+Tab navigate between editable cells</li>
                  <li>
                    Enter or clicking outside saves changes and triggers{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">onCellEdit</code>
                  </li>
                  <li>Escape cancels editing and reverts to the original value</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Advanced Features: Copy-Paste from Spreadsheets
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                One of the most powerful features of in-cell editing is spreadsheet-style
                copy-paste. Users can copy data from Excel or Google Sheets and paste it directly
                into your table:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Simple Table handles copy-paste automatically!
// Users can:
// 1. Select cells in Excel/Sheets
// 2. Copy (Ctrl+C / ⌘+C)
// 3. Select starting cell in your table
// 4. Paste (Ctrl+V / ⌘+V)

// Only columns with isEditable: true accept pasted data
// Non-editable columns (like IDs) are automatically skipped

<SimpleTable
  defaultHeaders={headers}
  rows={data}
  
  onCellEdit={handleCellEdit}
  // Copy-paste works out of the box!
  height="600px"
/>`}
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Copy-Paste Safety
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Simple Table's copy-paste feature respects your{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">isEditable</code>{" "}
                  settings. If a column is read-only (like an ID or calculated field), pasted values
                  are skipped for that column. This prevents accidental data corruption while still
                  allowing bulk edits.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                When to Use In-Cell Editing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Perfect Use Cases
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      • <strong>Bulk data entry:</strong> Updating inventory, pricing, or quantities
                      across many rows
                    </li>
                    <li>
                      • <strong>Quick corrections:</strong> Fixing typos, adjusting values, updating
                      statuses
                    </li>
                    <li>
                      • <strong>Spreadsheet migrations:</strong> Users familiar with Excel/Sheets
                      expect this workflow
                    </li>
                    <li>
                      • <strong>Simple data types:</strong> Single fields that don't require complex
                      validation
                    </li>
                    <li>
                      • <strong>High-frequency edits:</strong> When users need to modify dozens of
                      cells quickly
                    </li>
                    <li>
                      • <strong>Data import workflows:</strong> Copy-paste from external sources
                    </li>
                  </ul>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    When to Avoid
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      • <strong>Complex validation:</strong> Multi-field dependencies or business
                      rules
                    </li>
                    <li>
                      • <strong>Related data:</strong> Editing requires updating multiple related
                      records
                    </li>
                    <li>
                      • <strong>Rich content:</strong> Long text, WYSIWYG editors, file uploads
                    </li>
                    <li>
                      • <strong>Guided workflows:</strong> Users need help understanding what to
                      enter
                    </li>
                    <li>
                      • <strong>Mobile-first apps:</strong> Small screens make in-cell editing
                      frustrating
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form-Based Editing Section */}
        <section id="form-based-editing">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faFileAlt} className="text-blue-500" />
              Form-Based Editing: The Structured Approach
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Form-based editing opens a modal, drawer, or dedicated page when users want to edit
                a row. All fields are presented together in a structured form, often with labels,
                validation messages, and contextual help. It's the traditional CRUD (Create, Read,
                Update, Delete) pattern familiar from most web applications.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                How Form-Based Editing Works
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Users click an "Edit" button or icon in the table row, which triggers a form to
                open:
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300 list-disc list-inside">
                <li>
                  <strong>Modal overlay:</strong> Form appears centered over the table with a
                  backdrop
                </li>
                <li>
                  <strong>Side drawer:</strong> Form slides in from the right (common in admin
                  panels)
                </li>
                <li>
                  <strong>Dedicated page:</strong> Navigate to a full edit page (less common for
                  tables)
                </li>
              </ul>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The form displays all editable fields, validation rules, and related data. Users
                make changes, then click "Save" or "Cancel" to commit or discard their edits.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Implementing Form-Based Editing with Simple Table
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table doesn't include a built-in modal system (by design—it stays
                lightweight), but integrating with any modal library is straightforward using{" "}
                <Link
                  href="/docs/cell-clicking"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  cell click handlers
                </Link>{" "}
                or custom{" "}
                <Link
                  href="/docs/cell-renderer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  cell renderers
                </Link>
                :
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable, HeaderObject, CellClickProps } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd"; // or any UI library

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  hireDate: string;
  notes: string;
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([/* ... */]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Define headers with an "Actions" column
  const headers: HeaderObject[] = [
    {
      accessor: "name",
      label: "Name",
      width: 200,
    },
    {
      accessor: "email",
      label: "Email",
      width: 250,
    },
    {
      accessor: "department",
      label: "Department",
      width: 150,
    },
    {
      accessor: "salary",
      label: "Salary",
      type: "number",
      width: 120,
    },
    {
      accessor: "hireDate",
      label: "Hire Date",
      type: "date",
      width: 130,
    },
    {
      accessor: "actions",
      label: "Actions",
      width: 100,
      cellRenderer: ({ row }) => (
        <button
          onClick={() => handleEditClick(row)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
      ),
    },
  ];

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // Update local state
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee?.id ? { ...emp, ...values } : emp
        )
      );

      // Sync to backend
      await updateEmployeeAPI(editingEmployee!.id, values);

      setIsModalOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <>
      <SimpleTable
        defaultHeaders={headers}
        rows={employees}
        
        height="600px"
      />

      <Modal
        title="Edit Employee"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Engineering">Engineering</Select.Option>
              <Select.Option value="Sales">Sales</Select.Option>
              <Select.Option value="Marketing">Marketing</Select.Option>
              <Select.Option value="HR">HR</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Salary"
            name="salary"
            rules={[
              { required: true },
              { type: "number", min: 0, message: "Salary must be positive" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Hire Date" name="hireDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Notes" name="notes">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}`}
              />

              <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 dark:border-purple-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Alternative: Using onCellClick
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  You can also trigger form editing by clicking any cell, not just an "Actions"
                  column:
                </p>
                <CodeBlock
                  className="mb-0"
                  code={`<SimpleTable
  defaultHeaders={headers}
  rows={employees}
  
  onCellClick={({ row }) => {
    // Open edit form when any cell is clicked
    handleEditClick(row);
  }}
  height="600px"
/>`}
                />
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                When to Use Form-Based Editing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Perfect Use Cases
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      • <strong>Complex records:</strong> Many fields that don't fit in table
                      columns
                    </li>
                    <li>
                      • <strong>Rich validation:</strong> Cross-field rules, async validation,
                      complex business logic
                    </li>
                    <li>
                      • <strong>Related data:</strong> Editing affects multiple entities or requires
                      nested forms
                    </li>
                    <li>
                      • <strong>Long text fields:</strong> Descriptions, notes, comments that need
                      space
                    </li>
                    <li>
                      • <strong>File uploads:</strong> Images, documents, attachments
                    </li>
                    <li>
                      • <strong>Guided workflows:</strong> Step-by-step forms with conditional
                      fields
                    </li>
                    <li>
                      • <strong>Mobile apps:</strong> Forms work better on small screens than
                      in-cell editing
                    </li>
                  </ul>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    When to Avoid
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      • <strong>High-frequency edits:</strong> Opening a form for every change is
                      slow
                    </li>
                    <li>
                      • <strong>Bulk updates:</strong> Editing 50 rows via forms is tedious
                    </li>
                    <li>
                      • <strong>Simple fields:</strong> Overkill for changing a status or quantity
                    </li>
                    <li>
                      • <strong>Spreadsheet users:</strong> Excel-trained users expect in-cell
                      editing
                    </li>
                    <li>
                      • <strong>Quick corrections:</strong> Forms add friction for simple typo fixes
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section id="comparison">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBalanceScale} className="text-amber-500" />
              Head-to-Head Comparison
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Here's a detailed comparison to help you choose the right editing pattern for your
                React data grid:
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Factor
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        In-Cell Editing
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Form-Based Editing
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Speed
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ⚡ <strong>Fastest</strong> - Click, type, done. No context switching.
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        🐢 Slower - Click Edit → Wait for modal → Make changes → Click Save
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Bulk Edits
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ <strong>Excellent</strong> - Tab between cells, copy-paste from
                        spreadsheets
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ❌ Poor - Must open/close form for each row
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Complex Validation
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ⚠️ Limited - Hard to show detailed error messages in cells
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ <strong>Excellent</strong> - Space for validation messages, hints, help
                        text
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Related Data
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ❌ Poor - Can only edit one field at a time
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ <strong>Excellent</strong> - Edit multiple related entities together
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Rich Content
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ❌ Poor - Limited space for long text, WYSIWYG, file uploads
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ <strong>Excellent</strong> - Full-size editors, file pickers, rich text
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Mobile UX
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ⚠️ Challenging - Small touch targets, keyboard covers content
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ <strong>Better</strong> - Full-screen forms work well on mobile
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Learning Curve
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ <strong>Intuitive</strong> - Excel users understand immediately
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ <strong>Familiar</strong> - Standard web pattern, clear affordances
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Implementation
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ <strong>Simple</strong> - Built into most data grid libraries
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ⚠️ More work - Need modal/drawer component + form library
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Error Recovery
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ⚠️ Immediate - Errors show per-cell, can be disorienting
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ <strong>Better</strong> - All errors shown together, easier to fix
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Hybrid Approach Section */}
        <section id="hybrid-approach">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCogs} className="text-green-500" />
              The Hybrid Approach: Best of Both Worlds
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You don't have to choose just one! Many successful applications combine both editing
                patterns, using each where it makes the most sense:
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Pattern: Quick Edits + Detailed Form
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Allow in-cell editing for simple fields (status, quantity, price), but provide an
                "Edit Details" button that opens a form for complex fields (notes, attachments,
                related data):
              </p>

              <CodeBlock
                className="mb-6"
                code={`const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Product Name",
    type: "string",
    isEditable: true, // Quick in-cell edit
    width: 200,
  },
  {
    accessor: "price",
    label: "Price",
    type: "number",
    isEditable: true, // Quick in-cell edit
    width: 120,
  },
  {
    accessor: "stock",
    label: "Stock",
    type: "number",
    isEditable: true, // Quick in-cell edit
    width: 100,
  },
  {
    accessor: "status",
    label: "Status",
    type: "enum",
    isEditable: true, // Quick in-cell edit
    enumOptions: [/* ... */],
    width: 150,
  },
  {
    accessor: "actions",
    label: "Actions",
    width: 150,
    cellRenderer: ({ row }) => (
      <div className="flex gap-2">
        <button
          onClick={() => openDetailedForm(row)}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Edit Details
        </button>
        <button
          onClick={() => handleDelete(row.id)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    ),
  },
];

<SimpleTable
  defaultHeaders={headers}
  rows={products}
  
  onCellEdit={handleQuickEdit} // For in-cell edits
  height="600px"
/>

// Detailed form opens for:
// - Long descriptions
// - Image uploads
// - Related categories/tags
// - Detailed specifications`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Pattern: Context-Aware Editing
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Use in-cell editing on desktop (where users have keyboard + mouse), but switch to
                form-based editing on mobile (where in-cell editing is frustrating):
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { useState, useEffect } from "react";

export default function ResponsiveEditingTable() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop: in-cell editing
  const desktopHeaders: HeaderObject[] = [
    { accessor: "name", label: "Name", isEditable: true },
    { accessor: "email", label: "Email", isEditable: true },
    { accessor: "status", label: "Status", type: "enum", isEditable: true },
  ];

  // Mobile: form-based editing
  const mobileHeaders: HeaderObject[] = [
    { accessor: "name", label: "Name" },
    { accessor: "email", label: "Email" },
    {
      accessor: "actions",
      label: "",
      cellRenderer: ({ row }) => (
        <button onClick={() => openMobileForm(row)}>Edit</button>
      ),
    },
  ];

  return (
    <SimpleTable
      defaultHeaders={isMobile ? mobileHeaders : desktopHeaders}
      rows={data}
      
      onCellEdit={isMobile ? undefined : handleCellEdit}
      height="600px"
    />
  );
}`}
              />

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Real-World Example: E-Commerce Admin
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  A product management dashboard might use:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>
                    <strong>In-cell editing:</strong> Price, stock quantity, status (quick bulk
                    updates)
                  </li>
                  <li>
                    <strong>Form editing:</strong> Product description, images, SEO metadata,
                    related products
                  </li>
                  <li>
                    <strong>Bulk actions:</strong>{" "}
                    <Link
                      href="/blog/react-table-row-selection-guide"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Row selection
                    </Link>{" "}
                    + toolbar for bulk price updates, category changes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Tips Section */}
        <section id="implementation-tips">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Implementation Best Practices
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                For In-Cell Editing
              </h3>

              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    <FontAwesomeIcon icon={faKeyboard} className="text-blue-500 mr-2" />
                    Keyboard Navigation is Critical
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Users expect Excel-like keyboard shortcuts:
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                    <li>
                      <strong>Tab / Shift+Tab:</strong> Move between editable cells
                    </li>
                    <li>
                      <strong>Enter:</strong> Save and move to next row
                    </li>
                    <li>
                      <strong>Escape:</strong> Cancel editing and revert changes
                    </li>
                    <li>
                      <strong>Ctrl+C / Ctrl+V:</strong> Copy-paste from spreadsheets
                    </li>
                  </ul>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    Simple Table handles all of these automatically!
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ⚡ Optimistic Updates for Speed
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Update the UI immediately, then sync to the backend:
                  </p>
                  <CodeBlock
                    className="mb-0"
                    code={`const handleCellEdit = async ({ accessor, newValue, row }: CellChangeProps) => {
  // 1. Update UI immediately (optimistic)
  setData((prev) =>
    prev.map((item) =>
      item.id === row.id ? { ...item, [accessor]: newValue } : item
    )
  );

  // 2. Sync to backend (fire and forget)
  try {
    await updateAPI(row.id, accessor, newValue);
  } catch (error) {
    // 3. Revert on error
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, [accessor]: row[accessor] } : item
      )
    );
    showErrorToast("Update failed");
  }
};`}
                  />
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🎯 Visual Feedback for Editable Cells
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Make it obvious which cells are editable. Simple Table adds a subtle hover
                    effect by default. You can customize the appearance further by creating a{" "}
                    <Link
                      href="/docs/custom-theme"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      custom theme
                    </Link>{" "}
                    with CSS variables:
                  </p>
                  <CodeBlock
                    className="mb-0"
                    code={`/* custom-theme.css */
.theme-custom {
  --st-cell-hover-background-color: #f0f9ff;
  --st-selected-cell-background-color: #e0f2fe;
  /* ... other theme variables */
}

// Apply the custom theme
<SimpleTable
  theme="custom"
  defaultHeaders={headers}
  rows={data}
  
/>`}
                  />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                For Form-Based Editing
              </h3>

              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    💾 Prevent Accidental Data Loss
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Warn users if they try to close a form with unsaved changes:
                  </p>
                  <CodeBlock
                    className="mb-0"
                    code={`const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

const handleModalClose = () => {
  if (hasUnsavedChanges) {
    if (confirm("You have unsaved changes. Discard them?")) {
      setIsModalOpen(false);
      setHasUnsavedChanges(false);
    }
  } else {
    setIsModalOpen(false);
  }
};

<Modal
  open={isModalOpen}
  onCancel={handleModalClose}
  // ...
>`}
                  />
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ✅ Show Validation Errors Clearly
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Use a form library like React Hook Form, Formik, or Ant Design Form to handle
                    validation and error display:
                  </p>
                  <CodeBlock
                    className="mb-0"
                    code={`<Form.Item
  label="Email"
  name="email"
  rules={[
    { required: true, message: "Email is required" },
    { type: "email", message: "Must be a valid email" },
  ]}
>
  <Input />
</Form.Item>

// Errors show inline below the field
// Form won't submit until all validation passes`}
                  />
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🔄 Loading States During Save
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Disable the Save button and show a spinner while the API request is in flight:
                  </p>
                  <CodeBlock
                    className="mb-0"
                    code={`const [isSaving, setIsSaving] = useState(false);

const handleSave = async () => {
  setIsSaving(true);
  try {
    await updateAPI(data);
    setIsModalOpen(false);
  } catch (error) {
    showErrorToast(error.message);
  } finally {
    setIsSaving(false);
  }
};

<Button
  type="primary"
  onClick={handleSave}
  loading={isSaving}
  disabled={isSaving}
>
  {isSaving ? "Saving..." : "Save"}
</Button>`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Library Comparison Section */}
        <section id="library-comparison">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-purple-500" />
              Editing Support Across React Data Grid Libraries
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Not all React data grid libraries handle editing the same way. Here's how the major
                players compare:
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Library
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        In-Cell Editing
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Form Integration
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Copy-Paste
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                          Simple Table
                        </Link>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ Built-in with type-specific editors (string, number, date, enum, boolean)
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ Easy via <code>onCellClick</code> or custom cell renderers
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ Built-in, respects <code>isEditable</code> settings
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        <Link
                          href="/blog/ag-grid-alternatives-free-react-data-grids"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          AG Grid
                        </Link>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ Excellent, with custom cell editors and full-row editing
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ⚠️ Manual - need to implement your own modal/form
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ Advanced clipboard operations (Enterprise only)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        <Link
                          href="/blog/tanstack-table-vs-simple-table-headless-batteries-included"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          TanStack Table
                        </Link>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ⚠️ Headless - you build the editors yourself
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ Flexible - integrate any form library
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ❌ Not built-in, must implement yourself
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        <Link
                          href="/blog/handsontable-alternatives-free-react"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Handsontable
                        </Link>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ Excellent spreadsheet-like editing with formulas
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ⚠️ Manual - need to implement your own modal/form
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ Advanced copy-paste with formatting
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        <Link
                          href="/blog/material-react-table-vs-simple-table"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Material React Table
                        </Link>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ Built-in with Material-UI components
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ✅ Built-in row editing mode with Material-UI forms
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        ⚠️ Limited, basic copy-paste only
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Why Simple Table Stands Out
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Simple Table is one of the few libraries that provides:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>
                    <strong>Type-specific editors out of the box</strong> - No need to build custom
                    editors for numbers, dates, enums
                  </li>
                  <li>
                    <strong>Built-in copy-paste</strong> - Works with Excel/Sheets, respects
                    editable settings
                  </li>
                  <li>
                    <strong>Keyboard navigation</strong> - Tab, Enter, Escape all work as expected
                  </li>
                  <li>
                    <strong>Easy form integration</strong> - Simple hooks for opening modals/drawers
                  </li>
                  <li>
                    <strong>Lightweight</strong> - All this in a small bundle size
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Decision Framework Section */}
        <section id="decision-framework">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBalanceScale} className="text-green-500" />
              Decision Framework: Which Editing Pattern Should You Use?
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Use this decision tree to choose the right editing pattern for your use case:
              </p>

              <div className="space-y-4 mb-6">
                <div className="border-l-4 border-purple-400 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ❓ Are users editing more than 10 rows at a time?
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Yes →</strong> Use <strong>in-cell editing</strong>. Bulk edits are much
                    faster without opening/closing forms.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>No →</strong> Continue to next question.
                  </p>
                </div>

                <div className="border-l-4 border-blue-400 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ❓ Do you have more than 8 editable fields per row?
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Yes →</strong> Use <strong>form-based editing</strong>. Too many columns
                    make in-cell editing unwieldy.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>No →</strong> Continue to next question.
                  </p>
                </div>

                <div className="border-l-4 border-green-400 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ❓ Do you need complex validation (cross-field rules, async checks)?
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Yes →</strong> Use <strong>form-based editing</strong>. Forms provide
                    better space for validation messages.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>No →</strong> Continue to next question.
                  </p>
                </div>

                <div className="border-l-4 border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ❓ Do you need rich content editors (WYSIWYG, file uploads, nested data)?
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Yes →</strong> Use <strong>form-based editing</strong>. Rich editors
                    don't fit in table cells.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>No →</strong> Continue to next question.
                  </p>
                </div>

                <div className="border-l-4 border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ❓ Is this primarily a mobile app?
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Yes →</strong> Use <strong>form-based editing</strong>. In-cell editing
                    is frustrating on small touch screens.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>No →</strong> Continue to next question.
                  </p>
                </div>

                <div className="border-l-4 border-purple-400 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ❓ Are your users familiar with Excel/Google Sheets?
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Yes →</strong> Use <strong>in-cell editing</strong>. They'll expect and
                    appreciate the spreadsheet-like workflow.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>No →</strong> Either approach works. Consider a{" "}
                    <strong>hybrid approach</strong> with quick in-cell edits + detailed forms.
                  </p>
                </div>
              </div>

              <div className="bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  💡 Pro Tip: Start with In-Cell, Add Forms Later
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  If you're unsure, start with in-cell editing for simple fields. It's faster to
                  implement and easier to use. You can always add form-based editing later for
                  complex fields that need it. The hybrid approach gives you the best of both
                  worlds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Choosing the Right Editing Pattern for Your Users
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In-cell editing and form-based editing aren't competitors—they're complementary
                patterns that solve different problems. The best data grids use both, applying each
                where it makes the most sense:
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>In-cell editing</strong> for quick, frequent edits of simple data types
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Form-based editing</strong> for complex records with validation,
                    relationships, and rich content
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Hybrid approach</strong> when you need both—quick edits for some fields,
                    detailed forms for others
                  </span>
                </li>
              </ul>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                With Simple Table, you get powerful in-cell editing out of the box—type-specific
                editors, copy-paste from spreadsheets, keyboard navigation—all in a lightweight
                package. And when you need form-based editing, it integrates seamlessly with any
                modal or form library you choose.
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                The right choice depends on your users' workflow. Watch how they work, ask what
                frustrates them, and choose the pattern that makes their job easier. That's how you
                build data grids people love to use.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to build editable data grids that users love?"
        description="Simple Table provides powerful in-cell editing with type-specific editors, copy-paste from spreadsheets, and keyboard navigation—all out of the box. Plus, it integrates seamlessly with any form library for complex editing workflows."
        primaryButton={{
          text: "View Cell Editing Docs",
          href: "/docs/cell-editing",
        }}
        secondaryButton={{
          text: "Try Live Demo",
          href: "/docs/cell-editing",
        }}
      />
    </BlogLayout>
  );
}
