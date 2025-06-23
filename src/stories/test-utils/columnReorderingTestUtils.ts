import { within } from "@storybook/test";

/**
 * Get column order from a specific section
 */
export const getColumnOrderFromSection = (section: Element): string[] => {
  return Array.from(section.querySelectorAll(".st-header-label-text")).map(
    (el) => el.textContent || ""
  );
};

/**
 * Generic drag and drop function using the successful Direct Simulation approach
 */
export const performDragAndDrop = async (
  sourceElement: HTMLElement,
  targetElement: HTMLElement,
  description: string
): Promise<boolean> => {
  try {
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    // Create proper DataTransfer
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text/plain", "column-drag");
    dataTransfer.effectAllowed = "move";

    // Drag start
    const dragStartEvent = new DragEvent("dragstart", {
      bubbles: true,
      cancelable: true,
      clientX: startX,
      clientY: startY,
      screenX: startX + 100,
      screenY: startY + 100,
      dataTransfer: dataTransfer,
    });

    sourceElement.dispatchEvent(dragStartEvent);
    await new Promise((resolve) => setTimeout(resolve, 200));

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

      // Find the appropriate target container for dragover
      const targetContainer = targetElement.closest(".st-header-cell") || targetElement;
      targetContainer.dispatchEvent(dragOverEvent);

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Drop
    const dropEvent = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      clientX: endX,
      clientY: endY,
      screenX: endX + 100,
      screenY: endY + 100,
      dataTransfer: dataTransfer,
    });

    const targetContainer = targetElement.closest(".st-header-cell") || targetElement;
    targetContainer.dispatchEvent(dropEvent);
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

    sourceElement.dispatchEvent(dragEndEvent);
    await new Promise((resolve) => setTimeout(resolve, 200));

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Test moving columns within the main section
 */
export const testMainSectionColumnReordering = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const mainSection = canvasElement.querySelector(".st-header-main");
  if (!mainSection) {
    return false;
  }

  const initialOrder = getColumnOrderFromSection(mainSection);

  // Test: Move "Employees" to "Customer Rating" position
  const employeesLabel = mainSection.querySelector(
    "[id*='cell-employees'] .st-header-label"
  ) as HTMLElement;
  const customerRatingLabel = mainSection.querySelector(
    "[id*='cell-customerRating'] .st-header-label"
  ) as HTMLElement;

  if (!employeesLabel || !customerRatingLabel) {
    return false;
  }

  const success = await performDragAndDrop(
    employeesLabel,
    customerRatingLabel,
    "Employees → Customer Rating (within main section)"
  );

  if (success) {
    const finalOrder = getColumnOrderFromSection(mainSection);
    const orderChanged = JSON.stringify(finalOrder) !== JSON.stringify(initialOrder);
    if (orderChanged) {
      return true;
    }
  }

  return false;
};

/**
 * Test moving columns within pinned left section
 */
export const testPinnedLeftColumnReordering = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const pinnedLeftSection = canvasElement.querySelector(".st-header-pinned-left");
  if (!pinnedLeftSection) {
    return false;
  }

  const initialOrder = getColumnOrderFromSection(pinnedLeftSection);

  // Test: Move "Name" to "City" position (swap them)
  const nameLabel = pinnedLeftSection.querySelector(
    "[id*='cell-name'] .st-header-label"
  ) as HTMLElement;
  const cityLabel = pinnedLeftSection.querySelector(
    "[id*='cell-city'] .st-header-label"
  ) as HTMLElement;

  if (!nameLabel || !cityLabel) {
    return false;
  }

  const success = await performDragAndDrop(
    nameLabel,
    cityLabel,
    "Name → City (within pinned left section)"
  );

  if (success) {
    const finalOrder = getColumnOrderFromSection(pinnedLeftSection);
    const orderChanged = JSON.stringify(finalOrder) !== JSON.stringify(initialOrder);
    if (orderChanged) {
      return true;
    }
  }

  return false;
};

/**
 * Test moving column from main section to pinned left section
 */
export const testMainToPinnedLeftMove = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const mainSection = canvasElement.querySelector(".st-header-main");
  const pinnedLeftSection = canvasElement.querySelector(".st-header-pinned-left");

  if (!mainSection || !pinnedLeftSection) {
    return false;
  }

  const initialMainOrder = getColumnOrderFromSection(mainSection);
  const initialPinnedOrder = getColumnOrderFromSection(pinnedLeftSection);

  // Test: Move "Employees" from main to pinned left (target "City")
  const employeesLabel = mainSection.querySelector(
    "[id*='cell-employees'] .st-header-label"
  ) as HTMLElement;
  const cityLabel = pinnedLeftSection.querySelector(
    "[id*='cell-city'] .st-header-label"
  ) as HTMLElement;

  if (!employeesLabel || !cityLabel) {
    return false;
  }

  const success = await performDragAndDrop(
    employeesLabel,
    cityLabel,
    "Employees (main) → City (pinned left)"
  );

  if (success) {
    const finalMainOrder = getColumnOrderFromSection(mainSection);
    const finalPinnedOrder = getColumnOrderFromSection(pinnedLeftSection);

    const mainChanged = JSON.stringify(finalMainOrder) !== JSON.stringify(initialMainOrder);
    const pinnedChanged = JSON.stringify(finalPinnedOrder) !== JSON.stringify(initialPinnedOrder);

    if (mainChanged || pinnedChanged) {
      return true;
    }
  }

  return false;
};

/**
 * Test moving column from main section to pinned right section
 */
export const testMainToPinnedRightMove = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const mainSection = canvasElement.querySelector(".st-header-main");
  const pinnedRightSection = canvasElement.querySelector(".st-header-pinned-right");

  if (!mainSection || !pinnedRightSection) {
    return false;
  }

  const initialMainOrder = getColumnOrderFromSection(mainSection);
  const initialPinnedOrder = getColumnOrderFromSection(pinnedRightSection);

  // Test: Move "Square Footage" from main to pinned right (target "Total Sales")
  const squareFootageLabel = mainSection.querySelector(
    "[id*='cell-squareFootage'] .st-header-label"
  ) as HTMLElement;
  const totalSalesLabel = pinnedRightSection.querySelector(
    "[id*='cell-totalSales'] .st-header-label"
  ) as HTMLElement;

  if (!squareFootageLabel || !totalSalesLabel) {
    return false;
  }

  const success = await performDragAndDrop(
    squareFootageLabel,
    totalSalesLabel,
    "Square Footage (main) → Total Sales (pinned right)"
  );

  if (success) {
    const finalMainOrder = getColumnOrderFromSection(mainSection);
    const finalPinnedOrder = getColumnOrderFromSection(pinnedRightSection);

    const mainChanged = JSON.stringify(finalMainOrder) !== JSON.stringify(initialMainOrder);
    const pinnedChanged = JSON.stringify(finalPinnedOrder) !== JSON.stringify(initialPinnedOrder);

    if (mainChanged || pinnedChanged) {
      return true;
    }
  }

  return false;
};

/**
 * Test moving column from pinned left to main section
 */
export const testPinnedLeftToMainMove = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const mainSection = canvasElement.querySelector(".st-header-main");
  const pinnedLeftSection = canvasElement.querySelector(".st-header-pinned-left");

  if (!mainSection || !pinnedLeftSection) {
    return false;
  }

  const initialMainOrder = getColumnOrderFromSection(mainSection);
  const initialPinnedOrder = getColumnOrderFromSection(pinnedLeftSection);

  // Test: Move "City" from pinned left to main (target "Opening Date")
  const cityLabel = pinnedLeftSection.querySelector(
    "[id*='cell-city'] .st-header-label"
  ) as HTMLElement;
  const openingDateLabel = mainSection.querySelector(
    "[id*='cell-openingDate'] .st-header-label"
  ) as HTMLElement;

  if (!cityLabel || !openingDateLabel) {
    return false;
  }

  const success = await performDragAndDrop(
    cityLabel,
    openingDateLabel,
    "City (pinned left) → Opening Date (main)"
  );

  if (success) {
    const finalMainOrder = getColumnOrderFromSection(mainSection);
    const finalPinnedOrder = getColumnOrderFromSection(pinnedLeftSection);

    const mainChanged = JSON.stringify(finalMainOrder) !== JSON.stringify(initialMainOrder);
    const pinnedChanged = JSON.stringify(finalPinnedOrder) !== JSON.stringify(initialPinnedOrder);

    if (mainChanged || pinnedChanged) {
      return true;
    }
  }

  return false;
};

/**
 * Test moving column from pinned right to main section
 */
export const testPinnedRightToMainMove = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const mainSection = canvasElement.querySelector(".st-header-main");
  const pinnedRightSection = canvasElement.querySelector(".st-header-pinned-right");

  if (!mainSection || !pinnedRightSection) {
    return false;
  }

  const initialMainOrder = getColumnOrderFromSection(mainSection);
  const initialPinnedOrder = getColumnOrderFromSection(pinnedRightSection);

  // Test: Move "Total Sales" from pinned right to main (target "Furniture Sales")
  const totalSalesLabel = pinnedRightSection.querySelector(
    "[id*='cell-totalSales'] .st-header-label"
  ) as HTMLElement;
  const furnitureSalesLabel = mainSection.querySelector(
    "[id*='cell-furnitureSales'] .st-header-label"
  ) as HTMLElement;

  if (!totalSalesLabel || !furnitureSalesLabel) {
    return false;
  }

  const success = await performDragAndDrop(
    totalSalesLabel,
    furnitureSalesLabel,
    "Total Sales (pinned right) → Furniture Sales (main)"
  );

  if (success) {
    const finalMainOrder = getColumnOrderFromSection(mainSection);
    const finalPinnedOrder = getColumnOrderFromSection(pinnedRightSection);

    const mainChanged = JSON.stringify(finalMainOrder) !== JSON.stringify(initialMainOrder);
    const pinnedChanged = JSON.stringify(finalPinnedOrder) !== JSON.stringify(initialPinnedOrder);

    if (mainChanged || pinnedChanged) {
      return true;
    }
  }

  return false;
};

/**
 * Strategy 5: Direct useDragHandler simulation
 * This tries to work around the limitations by bypassing the event system
 */
export const testColumnReorderingDirectSimulation = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const mainSection = canvasElement.querySelector(".st-header-main");
  if (!mainSection) return false;

  const initialOrder = getColumnOrderFromSection(mainSection);

  const employeesCell = mainSection.querySelector("[id*='cell-employees']");
  const squareFootageCell = mainSection.querySelector("[id*='cell-squareFootage']");

  if (!employeesCell || !squareFootageCell) return false;

  const sourceLabel = employeesCell.querySelector(".st-header-label") as HTMLElement;
  const targetLabel = squareFootageCell.querySelector(".st-header-label") as HTMLElement;

  if (!sourceLabel || !targetLabel) return false;

  const success = await performDragAndDrop(
    sourceLabel,
    targetLabel,
    "Employees → Square Footage (basic test)"
  );

  if (success) {
    const finalOrder = getColumnOrderFromSection(mainSection);
    const orderChanged = JSON.stringify(finalOrder) !== JSON.stringify(initialOrder);

    if (orderChanged) {
      return true;
    }
  }

  return false;
};

/**
 * Strategy 6: Manual state manipulation (testing approach)
 * This directly calls any exposed methods rather than relying on events
 */
export const testColumnReorderingManualState = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
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
      // This would require more specific implementation based on your component structure
    }

    // For now, return false as this needs component-specific implementation
    return false;
  } catch (error) {
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

    return success;
  } catch (error) {
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

    return success;
  } catch (error) {
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

    return success;
  } catch (error) {
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

    return success;
  } catch (error) {
    return false;
  }
};

/**
 * Comprehensive column reordering test suite
 */
export const testAllColumnReorderingScenarios = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const tests = [
    { name: "Basic Main Section Reordering", test: testColumnReorderingDirectSimulation },
    { name: "Main Section Column Reordering", test: testMainSectionColumnReordering },
    { name: "Pinned Left Column Reordering", test: testPinnedLeftColumnReordering },
    { name: "Main → Pinned Left Move", test: testMainToPinnedLeftMove },
    { name: "Main → Pinned Right Move", test: testMainToPinnedRightMove },
    { name: "Pinned Left → Main Move", test: testPinnedLeftToMainMove },
    { name: "Pinned Right → Main Move", test: testPinnedRightToMainMove },
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const testCase of tests) {
    try {
      const result = await testCase.test(canvas, canvasElement);
      if (result) {
        passedTests++;
      }
    } catch (error) {
      // Test failed
    }

    // Wait between tests to allow state to settle
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return passedTests === totalTests;
};

/**
 * Main test function that tries all strategies (for backwards compatibility)
 */
export const testColumnReordering = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  // Run the comprehensive test suite instead of individual strategy testing
  return await testAllColumnReorderingScenarios(canvas, canvasElement);
};
