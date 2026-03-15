import HeaderObject from "../../types/HeaderObject";
import { HeaderRenderContext } from "./types";
import { createSelectionCheckbox } from "./selection";
import { addTrackedEventListener } from "./eventTracking";

export const createEditableInput = (
  header: HeaderObject,
  context: HeaderRenderContext,
  labelContainer: HTMLElement
): HTMLInputElement => {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "st-header-edit-input";
  input.value = header.label || "";
  
  const updateHeaderLabel = (newLabel: string) => {
    const updatedHeaders = context.headers.map((h) =>
      h.accessor === header.accessor ? { ...h, label: newLabel } : h
    );
    context.setHeaders(updatedHeaders);
    
    if (context.onHeaderEdit) {
      context.onHeaderEdit(header, newLabel);
    }
  };
  
  const handleBlur = () => {
    const newLabel = input.value;
    if (newLabel !== header.label) {
      updateHeaderLabel(newLabel);
    }

    const parent = labelContainer.parentElement;
    if (parent) {
      const newLabelContent = createLabelContent(header, context, newLabel);
      parent.replaceChild(newLabelContent, labelContainer);
    }

    if (context.headerRegistry && !header.isSelectionColumn) {
      const key = String(header.accessor);
      const entry = context.headerRegistry.get(key);
      if (entry) {
        entry.setEditing(false);
      }
    }
  };
  
  addTrackedEventListener(input, "blur", handleBlur as EventListener);
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      input.blur();
    } else if (event.key === "Escape") {
      event.preventDefault();
      input.value = header.label || "";
      input.blur();
    }
  };
  
  addTrackedEventListener(input, "keydown", handleKeyDown as EventListener);
  
  setTimeout(() => input.focus(), 0);
  
  return input;
};

export const createLabelContent = (
  header: HeaderObject,
  context: HeaderRenderContext,
  labelOverride?: string
): HTMLElement => {
  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;
  const displayLabel = labelOverride !== undefined ? labelOverride : (header.label || "");

  const labelTextSpan = document.createElement("span");
  labelTextSpan.className = `st-header-label-text ${
    header.align === "right"
      ? "right-aligned"
      : header.align === "center"
        ? "center-aligned"
        : "left-aligned"
  }`;

  if (isSelectionColumn) {
    const checkbox = createSelectionCheckbox(context);
    labelTextSpan.appendChild(checkbox);
  } else {
    labelTextSpan.textContent = displayLabel;
  }
  
  if (header.tooltip && !isSelectionColumn) {
    // Do not set native title - we show a custom .st-tooltip div instead.
    // Setting both would show two tooltips (browser default + our styled one).
    let tooltipElement: HTMLElement | null = null;
    let tooltipTimeout: NodeJS.Timeout | null = null;
    
    const showTooltip = () => {
      tooltipTimeout = setTimeout(() => {
        const rect = labelTextSpan.getBoundingClientRect();
        
        if (rect.width > 0 && rect.height > 0) {
          tooltipElement = document.createElement("div");
          tooltipElement.className = "st-tooltip";
          tooltipElement.textContent = header.tooltip || "";
          tooltipElement.style.position = "fixed";
          tooltipElement.style.zIndex = "10000";
          
          const tooltipWidth = 200;
          const tooltipHeight = 40;
          
          let left = rect.left + rect.width / 2 - tooltipWidth / 2;
          let top = rect.bottom + 8;
          
          if (left < 8) left = 8;
          else if (left + tooltipWidth > window.innerWidth - 8) {
            left = window.innerWidth - tooltipWidth - 8;
          }
          
          if (top + tooltipHeight > window.innerHeight - 8) {
            top = rect.top - tooltipHeight - 8;
          }
          
          tooltipElement.style.top = `${top}px`;
          tooltipElement.style.left = `${left}px`;
          
          const tableRoot = labelTextSpan.closest(".simple-table-root") as HTMLElement | null;
          (tableRoot || document.body).appendChild(tooltipElement);
        }
      }, 500);
    };
    
    const hideTooltip = () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
      }
      if (tooltipElement) {
        tooltipElement.parentElement?.removeChild(tooltipElement);
        tooltipElement = null;
      }
    };
    
    addTrackedEventListener(labelTextSpan, "mouseenter", showTooltip as EventListener);
    addTrackedEventListener(labelTextSpan, "mouseleave", hideTooltip as EventListener);
  }
  
  return labelTextSpan;
};
