import { SortList, ListViewItem } from "./index";

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

export const BasicExample = () => {
  const items = createSimpleItems();

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Basic Sort Animation Example</h2>
      <p>
        Click the sort button to reorder the items. Items will smoothly animate to their new
        positions using JavaScript and FLIP animation.
      </p>

      <SortList
        items={items}
        onItemClick={(item: ListViewItem) => console.log("Clicked item:", item.id)}
        animationConfig={{
          duration: 300,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h4>How it works:</h4>
        <ul>
          <li>Click the "Sort" button to toggle between ascending and descending order</li>
          <li>Items will smoothly animate to their new positions</li>
          <li>Click on items to interact with them</li>
          <li>The arrow indicates the current sort direction</li>
        </ul>
        <p>
          <strong>Note:</strong> All animations are done with JavaScript using the FLIP technique
          (First, Last, Invert, Play) for smooth, performant transitions. No external libraries
          required!
        </p>
      </div>
    </div>
  );
};

export default BasicExample;
