"use client";
import CellClickingDemo from "@/components/demos/CellClickingDemo";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const CELL_CLICKING_PROPS: PropInfo[] = [
  {
    key: "onCellClick",
    name: "onCellClick",
    required: false,
    description:
      "Callback function triggered when any cell is clicked. Provides comprehensive information about the clicked cell including its position, value, and containing row data.",
    type: "(props: CellClickProps) => void",
    link: "/docs/api-reference#cell-click-props",
    example: `const handleCellClick = (props) => {
  console.log('Clicked cell:', {
    column: props.accessor,
    value: props.value,
    row: props.row,
    position: [props.rowIndex, props.colIndex]
  });
  
  // Different actions based on column
  switch (props.accessor) {
    case 'name':
      // Navigate to user profile
      router.push(\`/users/\${props.row.id}\`);
      break;
    case 'status':
      // Toggle status
      toggleStatus(props.row.id);
      break;
    case 'actions':
      // Open context menu
      showContextMenu(props.row, props.colIndex, props.rowIndex);
      break;
  }
};

<SimpleTable 
  onCellClick={handleCellClick}
  // ... other props
/>`,
  },
];

export default function CellClickingContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faHandPointer} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cell Clicking</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Handle cell click events to create interactive table experiences. The{" "}
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">onCellClick</code> callback
        provides detailed information about each click, enabling navigation, modals, filtering, and
        quick actions.
      </motion.p>

      {/* Demo Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="cell-clicking"
          height="400px"
          Preview={CellClickingDemo}
        />
      </motion.div>

      {/* API Reference Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        API Reference
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <PropTable props={CELL_CLICKING_PROPS} title="Cell Clicking Props" />
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
}
