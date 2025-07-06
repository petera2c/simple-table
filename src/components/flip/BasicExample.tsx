import { SectionedSortList, ListViewItem, SectionedListViewItem } from "./index";

// Simple example data
const createSimpleItems = (): ListViewItem[] => [
  {
    id: 1,
    content: (
      <div style={{ padding: "12px", fontSize: "16px" }}>
        <strong>Item 1</strong> - First item in the list
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div style={{ padding: "12px", fontSize: "16px" }}>
        <strong>Item 2</strong> - Second item in the list
      </div>
    ),
  },
  {
    id: 3,
    content: (
      <div style={{ padding: "12px", fontSize: "16px" }}>
        <strong>Item 3</strong> - Third item in the list
      </div>
    ),
  },
  {
    id: 4,
    content: (
      <div style={{ padding: "12px", fontSize: "16px" }}>
        <strong>Item 4</strong> - Fourth item in the list
      </div>
    ),
  },
  {
    id: 5,
    content: (
      <div style={{ padding: "12px", fontSize: "16px" }}>
        <strong>Item 5</strong> - Fifth item in the list
      </div>
    ),
  },
];

// Create sectioned example data
const createSectionedItems = (): SectionedListViewItem[] => [
  {
    id: 1,
    sections: [
      {
        id: "title",
        content: <strong>Task 1</strong>,
      },
      {
        id: "priority",
        content: <span style={{ color: "#dc3545" }}>High</span>,
      },
      {
        id: "status",
        content: <span style={{ color: "#28a745" }}>Complete</span>,
      },
    ],
  },
  {
    id: 2,
    sections: [
      {
        id: "title",
        content: <strong>Task 2</strong>,
      },
      {
        id: "priority",
        content: <span style={{ color: "#ffc107" }}>Medium</span>,
      },
      {
        id: "status",
        content: <span style={{ color: "#17a2b8" }}>In Progress</span>,
      },
    ],
  },
  {
    id: 3,
    sections: [
      {
        id: "title",
        content: <strong>Task 3</strong>,
      },
      {
        id: "priority",
        content: <span style={{ color: "#6c757d" }}>Low</span>,
      },
      {
        id: "status",
        content: <span style={{ color: "#dc3545" }}>Blocked</span>,
      },
    ],
  },
];

export const BasicExample = () => {
  const items = createSimpleItems();
  const sectionedItems = createSectionedItems();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px" }}>
        <h3>Sectioned Animation</h3>
        <p>
          This example shows items with multiple sections. You can shuffle entire items or just the
          sections within each item. Each section animates independently.
        </p>

        <SectionedSortList
          items={sectionedItems}
          animationConfig={{
            duration: 350,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
      </div>
    </div>
  );
};

export default BasicExample;
