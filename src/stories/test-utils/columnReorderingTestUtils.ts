import { within } from "@storybook/test";

/**
 * Get column order from a specific section
 */
export const getColumnOrderFromSection = (section: Element): string[] => {
  const elements = Array.from(section.querySelectorAll(".st-header-label-text"));
  const order = elements.map((el) => el.textContent || "");

  return order;
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

    // Wait longer to allow for throttling delays
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Create more realistic drag movement with larger distances and proper timing
    const steps = 8; // More steps for better simulation
    const stepDelay = 10; // Longer delay to account for throttling

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      let currentX = startX + (endX - startX) * progress;
      let currentY = startY + (endY - startY) * progress;

      // Add some movement variation to make it more realistic
      if (i > 0 && i < steps) {
        currentX += Math.sin(progress * Math.PI) * 5; // Small horizontal variation
        currentY += Math.cos(progress * Math.PI) * 2; // Small vertical variation
      }

      // Ensure we move at least the minimum distance required
      const currentDistance = Math.sqrt((currentX - startX) ** 2 + (currentY - startY) ** 2);
      if (currentDistance < 15 && i > 0) {
        const direction = currentX > startX ? 1 : -1;
        currentX = startX + direction * Math.max(15, currentDistance);
      }

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

      // Manually call preventDefault to match what real browsers do
      dragOverEvent.preventDefault = () => {
        Object.defineProperty(dragOverEvent, "defaultPrevented", { value: true, writable: false });
      };

      targetContainer.dispatchEvent(dragOverEvent);

      // Wait longer between dragover events to respect throttling
      await new Promise((resolve) => setTimeout(resolve, stepDelay));
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

    // Wait longer after dragend to allow for async state updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    return true;
  } catch (error) {
    console.error("Drag and drop error:", error);
    return false;
  }
};
