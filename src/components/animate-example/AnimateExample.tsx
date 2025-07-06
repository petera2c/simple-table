import { SectionedListViewItem } from "../animate/types";
import SectionedSortList from "./SectionedSortList";

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

export const AnimateExample = () => {
  const sectionedItems = createSectionedItems();

  return (
    <SectionedSortList
      items={sectionedItems}
      animationConfig={{
        duration: 350,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    />
  );
};

export default AnimateExample;
