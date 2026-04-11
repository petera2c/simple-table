"use client";
import CellEditingDemo from "@/components/demos/CellEditingDemo";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const CELL_EDITING_PROPS: PropInfo[] = [
  {
    key: "isEditable",
    name: "HeaderObject.isEditable",
    required: false,
    description:
      "Makes a column editable, allowing users to modify cell values directly within the table interface.",
    type: "boolean",
    example: `{ 
  accessor: "name", 
  label: "Full Name", 
  isEditable: true 
}`,
  },
  {
    key: "type",
    name: "HeaderObject.type",
    required: false,
    description:
      "Specifies the data type and editor for the column. Simple Table provides specialized editors for different data types.",
    type: "enum",
    link: "/docs/api-reference#union-types",
    enumValues: ["string", "number", "boolean", "date", "enum"],
    example: `// String editor (default text input)
{ 
  accessor: "firstName", 
  label: "First Name", 
  type: "string",
  isEditable: true 
}

// Number editor (numeric input with validation)
{ 
  accessor: "salary", 
  label: "Salary", 
  type: "number",
  isEditable: true 
}

// Boolean editor (checkbox)
{ 
  accessor: "isActive", 
  label: "Active", 
  type: "boolean",
  isEditable: true 
}

// Date editor (date picker)
{ 
  accessor: "hireDate", 
  label: "Hire Date", 
  type: "date",
  isEditable: true 
}

// Enum editor (dropdown with options)
{ 
  accessor: "role", 
  label: "Role", 
  type: "enum",
  isEditable: true,
  enumOptions: [
    { label: "Developer", value: "Developer" },
    { label: "Designer", value: "Designer" },
    { label: "Manager", value: "Manager" }
  ]
}`,
  },
  {
    key: "onCellEdit",
    name: "onCellEdit",
    required: false,
    description:
      "Callback function that is triggered when a cell value is edited. Receives the cell change properties including accessor, newValue, and row data.",
    type: "(props: CellChangeProps) => void",
    link: "/docs/api-reference#cell-change-props",
    example: `const handleCellEdit = (props) => {
  console.log('Column:', props.accessor);
  console.log('New Value:', props.newValue);
  console.log('Row Data:', props.row);
  
  // Update your data state
  setData(prevData => 
    prevData.map(row => 
      row.id === props.row.id 
        ? { ...row, [props.accessor]: props.newValue }
        : row
    )
  );
};

<SimpleTable 
  onCellEdit={handleCellEdit}
  // ... other props
/>`,
  },
];

export default function CellEditingContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-purple-100 rounded-lg">
          <FontAwesomeIcon icon={faEdit} className="text-purple-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cell Editing</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Simple Table provides powerful cell editing capabilities, allowing users to modify data
        directly within the table interface. This creates a more interactive and efficient user
        experience for data entry and management. Unlike competitors, Simple Table provides
        specialized editors for different data types including strings, numbers, dates, booleans,
        and enumerated values.
      </motion.p>

      {/* Demo Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="cell-editing"
          height="400px"
          Preview={CellEditingDemo}
        />
      </motion.div>

      {/* Basic Editing Setup Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Editing Setup
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To enable cell editing in Simple Table, you need to:
        </p>

        <ol className="list-decimal pl-8 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>
            Add the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              isEditable: true
            </code>{" "}
            property to the columns you want to make editable
          </li>
          <li>
            Provide an{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              onCellEdit
            </code>{" "}
            handler to manage the data updates
          </li>
        </ol>

        <PropTable props={CELL_EDITING_PROPS} title="Cell Editing Properties" />

        {/* Copy-Paste Functionality Section */}
        <motion.h2
          className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          Copy-Paste Functionality
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.46 }}
        >
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Simple Table includes built-in copy-paste functionality that works seamlessly with cell
            editing:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>
              Users can copy data from any selected cells using keyboard shortcuts (Ctrl+C/⌘+C)
            </li>
            <li>
              Data can be pasted from external sources like spreadsheets or other applications
            </li>
            <li>
              <strong>Important:</strong> Pasting is only allowed into columns that have{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                isEditable: true
              </code>
            </li>
            <li>Non-editable columns will be skipped during paste operations</li>
          </ul>

          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg shadow-sm mb-6">
            <h4 className="font-bold text-gray-800 dark:text-white mb-2">
              Copy-Paste Restrictions
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              When pasting data, only columns marked with{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                isEditable: true
              </code>{" "}
              will accept the pasted values. This ensures data integrity and prevents accidental
              modification of read-only columns like IDs or calculated fields.
            </p>
          </div>
        </motion.div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
}
