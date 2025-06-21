import { expect, within } from "@storybook/test";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

/**
 * Simple wait function for table rendering
 */
export const waitForTable = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Get column order from a specific section
 */
const getColumnOrderFromSection = (section: Element): string[] => {
  return Array.from(section.querySelectorAll(".st-header-label-text")).map(
    (el) => el.textContent || ""
  );
};

/**
 * Strategy 5: Direct useDragHandler simulation
 * This tries to work around the limitations by bypassing the event system
 */
export const testColumnReorderingDirectSimulation = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  console.log("Testing column reordering with direct simulation...");

  const mainSection = canvasElement.querySelector(".st-header-main");
  if (!mainSection) return false;

  const initialOrder = getColumnOrderFromSection(mainSection);

  const employeesCell = mainSection.querySelector("[id*='cell-employees']");
  const squareFootageCell = mainSection.querySelector("[id*='cell-squareFootage']");

  if (!employeesCell || !squareFootageCell) return false;

  const sourceLabel = employeesCell.querySelector(".st-header-label") as HTMLElement;
  const targetLabel = squareFootageCell.querySelector(".st-header-label") as HTMLElement;

  if (!sourceLabel || !targetLabel) return false;

  try {
    // Try to access the table context or drag handlers directly
    // This is a bit hacky but might work if the handlers are exposed
    const employeesHeader = {
      accessor: "employees",
      label: "Employees",
    };

    const squareFootageHeader = {
      accessor: "squareFootage",
      label: "Square Footage",
    };

    // Create a more realistic drag event with proper coordinates
    const sourceRect = sourceLabel.getBoundingClientRect();
    const targetRect = targetLabel.getBoundingClientRect();

    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    // Ensure significant distance (> 10px as required by useDragHandler)
    const distance = Math.abs(endX - startX);
    console.log(`Distance between elements: ${distance}px`);

    if (distance < 50) {
      console.log("⚠️ Distance too small, adjusting coordinates");
      // Adjust to ensure minimum distance
    }

    // Create a proper DataTransfer with required data
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text/plain", "employees"); // Set some data
    dataTransfer.effectAllowed = "move";

    // Sequence with longer delays to avoid throttling
    const dragStartEvent = new DragEvent("dragstart", {
      bubbles: true,
      cancelable: true,
      clientX: startX,
      clientY: startY,
      screenX: startX + 100, // Add screen offset
      screenY: startY + 100,
      dataTransfer: dataTransfer,
    });

    sourceLabel.dispatchEvent(dragStartEvent);
    console.log("Dispatched dragstart");

    await new Promise((resolve) => setTimeout(resolve, 200)); // Longer delay

    // Multiple dragover events to simulate realistic dragging
    for (let i = 0; i < 3; i++) {
      const progress = (i + 1) / 3;
      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;

      const dragOverEvent = new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        clientX: currentX,
        clientY: currentY,
        screenX: currentX + 100,
        screenY: currentY + 100,
        dataTransfer: dataTransfer,
      });

      // Prevent default to allow drop
      dragOverEvent.preventDefault = () => {};
      squareFootageCell.dispatchEvent(dragOverEvent);

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log("Dispatched dragover sequence");

    // Final drop
    const dropEvent = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      clientX: endX,
      clientY: endY,
      screenX: endX + 100,
      screenY: endY + 100,
      dataTransfer: dataTransfer,
    });

    squareFootageCell.dispatchEvent(dropEvent);
    console.log("Dispatched drop");

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Drag end
    const dragEndEvent = new DragEvent("dragend", {
      bubbles: true,
      cancelable: true,
      clientX: endX,
      clientY: endY,
      screenX: endX + 100,
      screenY: endY + 100,
      dataTransfer: dataTransfer,
    });

    sourceLabel.dispatchEvent(dragEndEvent);
    console.log("Dispatched dragend");

    await new Promise((resolve) => setTimeout(resolve, 200));

    const finalOrder = getColumnOrderFromSection(mainSection);
    const success = JSON.stringify(finalOrder) !== JSON.stringify(initialOrder);

    if (success) {
      console.log("✅ Direct simulation strategy worked!");
    } else {
      console.log("❌ Direct simulation failed - checking for visual changes...");

      // Check if any visual changes occurred (like dragging class)
      const isDragging = sourceLabel.closest(".st-dragging") !== null;
      const isHovered = targetLabel.closest(".st-hovered") !== null;

      console.log(`Visual state - dragging: ${isDragging}, hovered: ${isHovered}`);
    }

    return success;
  } catch (error) {
    console.log("❌ Direct simulation strategy failed:", error);
    return false;
  }
};

/**
 * Strategy 6: Manual state manipulation (testing approach)
 * This directly calls any exposed methods rather than relying on events
 */
export const testColumnReorderingManualState = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  console.log("Testing column reordering with manual state manipulation...");

  try {
    // This is a testing-specific approach where we try to directly
    // manipulate the component state if possible

    // Look for any exposed methods or context
    const tableElement = canvasElement.querySelector(".simple-table-root");
    if (!tableElement) return false;

    // Try to find React fiber or any exposed handlers
    const fiberKey = Object.keys(tableElement).find(
      (key) => key.startsWith("__reactInternalInstance") || key.startsWith("__reactFiber")
    );

    if (fiberKey) {
      console.log("Found React fiber, attempting state manipulation...");
      // This would require more specific implementation based on your component structure
    }

    // For now, return false as this needs component-specific implementation
    console.log("Manual state manipulation not implemented - would need component internals");
    return false;
  } catch (error) {
    console.log("❌ Manual state manipulation failed:", error);
    return false;
  }
};

/**
 * Strategy 1: Mouse Events (mousedown, mousemove, mouseup)
 */
export const testColumnReorderingMouseEvents = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  console.log("Testing column reordering with mouse events...");

  const mainSection = canvasElement.querySelector(".st-header-main");
  if (!mainSection) return false;

  const initialOrder = getColumnOrderFromSection(mainSection);

  const employeesCell = mainSection.querySelector("[id*='cell-employees']");
  const squareFootageCell = mainSection.querySelector("[id*='cell-squareFootage']");

  if (!employeesCell || !squareFootageCell) return false;

  const sourceLabel = employeesCell.querySelector(".st-header-label") as HTMLElement;
  const targetLabel = squareFootageCell.querySelector(".st-header-label") as HTMLElement;

  if (!sourceLabel || !targetLabel) return false;

  const sourceRect = sourceLabel.getBoundingClientRect();
  const targetRect = targetLabel.getBoundingClientRect();

  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  try {
    // Mouse down
    sourceLabel.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: startX,
        clientY: startY,
        button: 0,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Mouse move
    sourceLabel.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        button: 0,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Mouse up on target
    targetLabel.dispatchEvent(
      new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        button: 0,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const finalOrder = getColumnOrderFromSection(mainSection);
    const success = JSON.stringify(finalOrder) !== JSON.stringify(initialOrder);

    if (success) {
      console.log("✅ Mouse events strategy worked!");
    }

    return success;
  } catch (error) {
    console.log("❌ Mouse events strategy failed:", error);
    return false;
  }
};

/**
 * Strategy 2: Drag Events (simplified)
 */
export const testColumnReorderingDragEvents = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  console.log("Testing column reordering with drag events...");

  const mainSection = canvasElement.querySelector(".st-header-main");
  if (!mainSection) return false;

  const initialOrder = getColumnOrderFromSection(mainSection);

  const employeesCell = mainSection.querySelector("[id*='cell-employees']");
  const squareFootageCell = mainSection.querySelector("[id*='cell-squareFootage']");

  if (!employeesCell || !squareFootageCell) return false;

  const sourceLabel = employeesCell.querySelector(".st-header-label") as HTMLElement;
  const targetLabel = squareFootageCell.querySelector(".st-header-label") as HTMLElement;

  if (!sourceLabel || !targetLabel) return false;

  const sourceRect = sourceLabel.getBoundingClientRect();
  const targetRect = targetLabel.getBoundingClientRect();

  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  try {
    const dataTransfer = new DataTransfer();

    // Drag start
    sourceLabel.dispatchEvent(
      new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        clientX: startX,
        clientY: startY,
        dataTransfer: dataTransfer,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Drag over
    squareFootageCell.dispatchEvent(
      new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        dataTransfer: dataTransfer,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Drop
    squareFootageCell.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        dataTransfer: dataTransfer,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Drag end
    sourceLabel.dispatchEvent(
      new DragEvent("dragend", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        dataTransfer: dataTransfer,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const finalOrder = getColumnOrderFromSection(mainSection);
    const success = JSON.stringify(finalOrder) !== JSON.stringify(initialOrder);

    if (success) {
      console.log("✅ Drag events strategy worked!");
    }

    return success;
  } catch (error) {
    console.log("❌ Drag events strategy failed:", error);
    return false;
  }
};

/**
 * Strategy 3: Pointer Events
 */
export const testColumnReorderingPointerEvents = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  console.log("Testing column reordering with pointer events...");

  const mainSection = canvasElement.querySelector(".st-header-main");
  if (!mainSection) return false;

  const initialOrder = getColumnOrderFromSection(mainSection);

  const employeesCell = mainSection.querySelector("[id*='cell-employees']");
  const squareFootageCell = mainSection.querySelector("[id*='cell-squareFootage']");

  if (!employeesCell || !squareFootageCell) return false;

  const sourceLabel = employeesCell.querySelector(".st-header-label") as HTMLElement;
  const targetLabel = squareFootageCell.querySelector(".st-header-label") as HTMLElement;

  if (!sourceLabel || !targetLabel) return false;

  const sourceRect = sourceLabel.getBoundingClientRect();
  const targetRect = targetLabel.getBoundingClientRect();

  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  try {
    // Pointer down
    sourceLabel.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        clientX: startX,
        clientY: startY,
        pointerId: 1,
        pointerType: "mouse",
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Pointer move
    sourceLabel.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        pointerId: 1,
        pointerType: "mouse",
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Pointer up on target
    targetLabel.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        pointerId: 1,
        pointerType: "mouse",
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const finalOrder = getColumnOrderFromSection(mainSection);
    const success = JSON.stringify(finalOrder) !== JSON.stringify(initialOrder);

    if (success) {
      console.log("✅ Pointer events strategy worked!");
    }

    return success;
  } catch (error) {
    console.log("❌ Pointer events strategy failed:", error);
    return false;
  }
};

/**
 * Strategy 4: Combined approach (mouse + drag)
 */
export const testColumnReorderingCombined = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  console.log("Testing column reordering with combined approach...");

  const mainSection = canvasElement.querySelector(".st-header-main");
  if (!mainSection) return false;

  const initialOrder = getColumnOrderFromSection(mainSection);

  const employeesCell = mainSection.querySelector("[id*='cell-employees']");
  const squareFootageCell = mainSection.querySelector("[id*='cell-squareFootage']");

  if (!employeesCell || !squareFootageCell) return false;

  const sourceLabel = employeesCell.querySelector(".st-header-label") as HTMLElement;
  const targetLabel = squareFootageCell.querySelector(".st-header-label") as HTMLElement;

  if (!sourceLabel || !targetLabel) return false;

  const sourceRect = sourceLabel.getBoundingClientRect();
  const targetRect = targetLabel.getBoundingClientRect();

  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  try {
    const dataTransfer = new DataTransfer();

    // Start with mouse down
    sourceLabel.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: startX,
        clientY: startY,
        button: 0,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Then drag start
    sourceLabel.dispatchEvent(
      new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        clientX: startX,
        clientY: startY,
        dataTransfer: dataTransfer,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Mouse move
    document.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        button: 0,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Drag over
    squareFootageCell.dispatchEvent(
      new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        dataTransfer: dataTransfer,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Drop
    squareFootageCell.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        dataTransfer: dataTransfer,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Mouse up
    targetLabel.dispatchEvent(
      new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        button: 0,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Drag end
    sourceLabel.dispatchEvent(
      new DragEvent("dragend", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        dataTransfer: dataTransfer,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const finalOrder = getColumnOrderFromSection(mainSection);
    const success = JSON.stringify(finalOrder) !== JSON.stringify(initialOrder);

    if (success) {
      console.log("✅ Combined strategy worked!");
    }

    return success;
  } catch (error) {
    console.log("❌ Combined strategy failed:", error);
    return false;
  }
};

/**
 * Main test function that tries all strategies
 */
export const testColumnReordering = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  console.log("🚀 Testing column reordering with multiple strategies...");

  const strategies = [
    { name: "Direct Simulation", test: testColumnReorderingDirectSimulation },
    { name: "Mouse Events", test: testColumnReorderingMouseEvents },
    { name: "Drag Events", test: testColumnReorderingDragEvents },
    { name: "Pointer Events", test: testColumnReorderingPointerEvents },
    { name: "Combined Approach", test: testColumnReorderingCombined },
    { name: "Manual State", test: testColumnReorderingManualState },
  ];

  for (const strategy of strategies) {
    console.log(`\n--- Trying ${strategy.name} ---`);

    try {
      const success = await strategy.test(canvas, canvasElement);
      if (success) {
        console.log(`🎉 SUCCESS: ${strategy.name} worked!`);
        return true;
      }
    } catch (error) {
      console.log(`❌ ${strategy.name} threw error:`, error);
    }

    // Wait between attempts
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log("❌ All strategies failed to reorder columns");
  console.log("\n💡 This is likely due to drag-and-drop limitations in test environments.");
  console.log(
    "Consider testing the drag functionality manually or using integration tests with real browser automation."
  );
  return false;
};
