/**
 * Creates a vanilla JS checkbox element
 */

export interface CreateCheckboxOptions {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}

const createCheckmarkSVG = (): SVGSVGElement => {
  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute("aria-hidden", "true");
  svgElement.setAttribute("role", "img");
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElement.setAttribute("viewBox", "0 0 448 512");
  svgElement.setAttribute("class", "st-checkbox-checkmark");
  svgElement.style.height = "10px";
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z");
  svgElement.appendChild(path);
  
  return svgElement;
};

export const createCheckbox = ({ checked, onChange, ariaLabel }: CreateCheckboxOptions) => {
  const label = document.createElement("label");
  label.className = "st-checkbox-label";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;
  input.className = "st-checkbox-input";
  if (ariaLabel) {
    input.setAttribute("aria-label", ariaLabel);
  }
  input.setAttribute("aria-checked", checked.toString());

  const customCheckbox = document.createElement("span");
  customCheckbox.className = `st-checkbox-custom ${checked ? "st-checked" : ""}`;
  customCheckbox.setAttribute("aria-hidden", "true");

  if (checked) {
    customCheckbox.appendChild(createCheckmarkSVG());
  }

  const toggleCheckbox = () => {
    const newChecked = input.checked;
    input.setAttribute("aria-checked", newChecked.toString());
    
    if (newChecked) {
      customCheckbox.classList.add("st-checked");
      customCheckbox.appendChild(createCheckmarkSVG());
    } else {
      customCheckbox.classList.remove("st-checked");
      customCheckbox.innerHTML = "";
    }
    
    onChange(newChecked);
  };

  input.addEventListener("change", toggleCheckbox);
  
  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === " ") {
      e.stopPropagation();
    }
  });

  // Prevent drag events from interfering with checkbox clicks
  label.addEventListener("mousedown", (e: MouseEvent) => {
    e.stopPropagation();
  });
  
  label.addEventListener("dragstart", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  });

  label.appendChild(input);
  label.appendChild(customCheckbox);

  return {
    element: label,
    update: (newChecked: boolean) => {
      if (input.checked !== newChecked) {
        input.checked = newChecked;
        input.setAttribute("aria-checked", newChecked.toString());
        
        if (newChecked) {
          customCheckbox.classList.add("st-checked");
          customCheckbox.innerHTML = "";
          customCheckbox.appendChild(createCheckmarkSVG());
        } else {
          customCheckbox.classList.remove("st-checked");
          customCheckbox.innerHTML = "";
        }
      }
    },
    destroy: () => {
      input.removeEventListener("change", toggleCheckbox);
    },
  };
};
