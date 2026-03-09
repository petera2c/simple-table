// Date picker editor (calendar-based date selection)

import { AbsoluteBodyCell, CellRenderContext } from "../types";
import { setNestedValue } from "../../rowUtils";
import { createDropdown } from "./dropdown";
import { addTrackedEventListener } from "../eventTracking";
import { parseDateString } from "../../dateUtils";

// Helper to get days in month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to get first day of month (0 = Sunday, 6 = Saturday)
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

// Month names
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Day names
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const createDatePicker = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  currentValue: any,
  onComplete: () => void,
): HTMLElement => {
  const { header, row, rowIndex } = cell;

  // Declare dropdown variable that will be set after creation
  let dropdown: HTMLElement;

  // Parse current date
  let selectedDate: Date;
  try {
    selectedDate = currentValue ? parseDateString(String(currentValue)) : new Date();
  } catch {
    selectedDate = new Date();
  }

  let viewYear = selectedDate.getFullYear();
  let viewMonth = selectedDate.getMonth();

  // Create date picker container
  const container = document.createElement("div");
  container.className = "st-date-picker";

  // Create header with month/year navigation
  const header_el = document.createElement("div");
  header_el.className = "st-date-picker-header";

  const prevButton = document.createElement("button");
  prevButton.className = "st-date-picker-nav";
  prevButton.innerHTML = "‹";
  prevButton.setAttribute("aria-label", "Previous month");

  const monthYearLabel = document.createElement("div");
  monthYearLabel.className = "st-date-picker-month-year";

  const nextButton = document.createElement("button");
  nextButton.className = "st-date-picker-nav";
  nextButton.innerHTML = "›";
  nextButton.setAttribute("aria-label", "Next month");

  header_el.appendChild(prevButton);
  header_el.appendChild(monthYearLabel);
  header_el.appendChild(nextButton);

  // Create calendar grid
  const calendarGrid = document.createElement("div");
  calendarGrid.className = "st-date-picker-grid";

  // Create day headers
  const dayHeadersRow = document.createElement("div");
  dayHeadersRow.className = "st-date-picker-day-headers";
  DAY_NAMES.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "st-date-picker-day-header";
    dayHeader.textContent = day;
    dayHeadersRow.appendChild(dayHeader);
  });

  calendarGrid.appendChild(dayHeadersRow);

  // Days container
  const daysContainer = document.createElement("div");
  daysContainer.className = "st-date-picker-days";
  calendarGrid.appendChild(daysContainer);

  container.appendChild(header_el);
  container.appendChild(calendarGrid);

  const handleDateSelect = (date: Date) => {
    // Format as yyyy-mm-dd
    const formattedDate = date.toISOString().split("T")[0];

    // Update the row data
    setNestedValue(row, header.accessor, formattedDate);

    // Call onCellEdit callback
    if (context.onCellEdit) {
      context.onCellEdit({
        accessor: header.accessor,
        newValue: formattedDate,
        row,
        rowIndex,
      });
    }

    // Remove dropdown from DOM manually, then call onComplete
    dropdown.remove();
    onComplete();
  };

  const renderCalendar = () => {
    // Update month/year label
    monthYearLabel.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

    // Clear days
    daysContainer.innerHTML = "";

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "st-date-picker-day empty";
      daysContainer.appendChild(emptyCell);
    }

    // Add day cells
    const today = new Date();
    const isSelectedMonth =
      selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement("div");
      dayCell.className = "st-date-picker-day";
      dayCell.textContent = String(day);
      dayCell.setAttribute("tabindex", "0");
      dayCell.setAttribute("role", "button");
      dayCell.setAttribute("aria-label", `${MONTH_NAMES[viewMonth]} ${day}, ${viewYear}`);

      // Check if this is today
      if (
        today.getFullYear() === viewYear &&
        today.getMonth() === viewMonth &&
        today.getDate() === day
      ) {
        dayCell.classList.add("today");
      }

      // Check if this is the selected date
      if (isSelectedMonth && selectedDate.getDate() === day) {
        dayCell.classList.add("selected");
      }

      const date = new Date(viewYear, viewMonth, day);

      addTrackedEventListener(dayCell, "click", () => handleDateSelect(date));

      addTrackedEventListener(dayCell, "keydown", (event: Event) => {
        const e = event as KeyboardEvent;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleDateSelect(date);
        }
      });

      daysContainer.appendChild(dayCell);
    }
  };

  // Navigation handlers
  addTrackedEventListener(prevButton, "click", () => {
    viewMonth--;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear--;
    }
    renderCalendar();
  });

  addTrackedEventListener(nextButton, "click", () => {
    viewMonth++;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear++;
    }
    renderCalendar();
  });

  // Initial render
  renderCalendar();

  // Get the cell element as trigger - use correct ID format
  const cellId = `${cell.rowId}-${header.accessor}`;
  const cellElement = document.getElementById(cellId) as HTMLElement;

  // Create and show dropdown
  dropdown = createDropdown(cellElement || document.body, container, {
    width: 280,
    positioning: "fixed",
    onClose: onComplete,
  });

  return dropdown;
};
