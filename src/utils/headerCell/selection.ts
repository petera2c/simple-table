import { HeaderRenderContext } from "./types";
import { createSVGIcon } from "./icons";
import { addTrackedEventListener } from "./eventTracking";

export const createSelectionCheckbox = (context: HeaderRenderContext): HTMLElement => {
  const label = document.createElement("label");
  label.className = "st-checkbox-label";
  
  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "st-checkbox-input";
  input.setAttribute("aria-label", "Select all rows");
  
  const checked = context.areAllRowsSelected ? context.areAllRowsSelected() : false;
  input.checked = checked;
  input.setAttribute("aria-checked", String(checked));
  
  const customCheckbox = document.createElement("span");
  customCheckbox.className = `st-checkbox-custom ${checked ? "st-checked" : ""}`;
  customCheckbox.setAttribute("aria-hidden", "true");
  
  if (checked) {
    const svg = createSVGIcon("check", "st-checkbox-checkmark");
    customCheckbox.appendChild(svg);
  }
  
  const handleChange = () => {
    const newChecked = !input.checked;
    if (context.handleSelectAll) {
      context.handleSelectAll(newChecked);
    }
  };
  
  addTrackedEventListener(input, "change", handleChange as EventListener);
  
  const handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === " ") {
      keyEvent.stopPropagation();
    }
  };
  
  addTrackedEventListener(input, "keydown", handleKeyDown);
  
  label.appendChild(input);
  label.appendChild(customCheckbox);
  
  return label;
};
