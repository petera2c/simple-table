// Date picker editor (calendar-based date selection)

import { AbsoluteBodyCell, CellRenderContext } from "../types";
import { setNestedValue } from "../../rowUtils";
import { createDropdown } from "./dropdown";
import { addTrackedEventListener } from "../eventTracking";
import { parseDateString } from "../../dateUtils";
import { getCellId } from "../../cellUtils";
import { createAngleLeftIcon, createAngleRightIcon } from "../../../icons";

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

// Day names (short to match CSS layout)
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

  // Create date picker container (match CSS: .st-datepicker)
  const container = document.createElement("div");
  container.className = "st-datepicker";

  // Create header with month/year navigation (match CSS: .st-datepicker-header)
  const headerEl = document.createElement("div");
  headerEl.className = "st-datepicker-header";

  const prevButton = document.createElement("button");
  prevButton.className = "st-datepicker-nav-btn";
  prevButton.setAttribute("aria-label", "Previous month");
  const prevIcon = context.icons.prev ?? createAngleLeftIcon("st-next-prev-icon");
  if (typeof prevIcon === "string") {
    prevButton.innerHTML = prevIcon;
  } else {
    prevButton.appendChild(prevIcon.cloneNode(true) as HTMLElement);
  }

  const monthYearLabel = document.createElement("div");
  monthYearLabel.className = "st-datepicker-header-label";
  monthYearLabel.setAttribute("aria-hidden", "true");

  const nextButton = document.createElement("button");
  nextButton.className = "st-datepicker-nav-btn";
  nextButton.setAttribute("aria-label", "Next month");
  const nextIcon = context.icons.next ?? createAngleRightIcon("st-next-prev-icon");
  if (typeof nextIcon === "string") {
    nextButton.innerHTML = nextIcon;
  } else {
    nextButton.appendChild(nextIcon.cloneNode(true) as HTMLElement);
  }

  headerEl.appendChild(prevButton);
  headerEl.appendChild(monthYearLabel);
  headerEl.appendChild(nextButton);

  // Single grid for days view (match CSS: .st-datepicker-grid.st-datepicker-days-grid)
  // Direct children: 7 weekdays then day cells (empty + filled)
  const grid = document.createElement("div");
  grid.className = "st-datepicker-grid st-datepicker-days-grid";

  DAY_NAMES.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "st-datepicker-weekday";
    dayHeader.textContent = day;
    grid.appendChild(dayHeader);
  });

  // Footer with Today button (match CSS: .st-datepicker-footer, .st-datepicker-today-btn)
  const footer = document.createElement("div");
  footer.className = "st-datepicker-footer";

  const todayBtn = document.createElement("button");
  todayBtn.className = "st-datepicker-today-btn";
  todayBtn.textContent = "Today";

  addTrackedEventListener(todayBtn, "click", () => {
    const today = new Date();
    const noon = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12,
      0,
      0,
    );
    handleDateSelect(noon);
  });

  footer.appendChild(todayBtn);

  container.appendChild(headerEl);
  container.appendChild(grid);
  container.appendChild(footer);

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

    // Remove only day cells (keep the 7 weekday headers)
    const weekdayCount = 7;
    while (grid.children.length > weekdayCount) {
      grid.lastElementChild?.remove();
    }

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const daysInPrevMonth = getDaysInMonth(viewYear, viewMonth - 1);

    const today = new Date();

    // Previous month days (leading cells)
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDay = daysInPrevMonth - firstDay + i + 1;
      const date = new Date(viewYear, viewMonth - 1, prevMonthDay);
      const dayCell = document.createElement("div");
      dayCell.className = "st-datepicker-day other-month";
      dayCell.textContent = String(prevMonthDay);
      dayCell.setAttribute("tabindex", "0");
      dayCell.setAttribute("role", "button");
      dayCell.setAttribute(
        "aria-label",
        `${MONTH_NAMES[viewMonth - 1] ?? MONTH_NAMES[11]} ${prevMonthDay}, ${date.getFullYear()}`,
      );

      addTrackedEventListener(dayCell, "click", () => handleDateSelect(date));
      addTrackedEventListener(dayCell, "keydown", (event: Event) => {
        const e = event as KeyboardEvent;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleDateSelect(date);
        }
      });
      grid.appendChild(dayCell);
    }

    // Current month days
    const isSelectedMonth =
      selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement("div");
      dayCell.className = "st-datepicker-day";
      dayCell.textContent = String(day);
      dayCell.setAttribute("tabindex", "0");
      dayCell.setAttribute("role", "button");
      dayCell.setAttribute("aria-label", `${MONTH_NAMES[viewMonth]} ${day}, ${viewYear}`);

      if (
        today.getFullYear() === viewYear &&
        today.getMonth() === viewMonth &&
        today.getDate() === day
      ) {
        dayCell.classList.add("today");
      }
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
      grid.appendChild(dayCell);
    }

    // Next month days (trailing cells): fill so grid has complete rows (multiple of 7), min 5 rows (35)
    const minDayCells = 35;
    const filledSoFar = firstDay + daysInMonth;
    const totalDayCells = Math.max(minDayCells, Math.ceil(filledSoFar / 7) * 7);
    const remainingCells = totalDayCells - filledSoFar;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(viewYear, viewMonth + 1, day);
      const dayCell = document.createElement("div");
      dayCell.className = "st-datepicker-day other-month";
      dayCell.textContent = String(day);
      dayCell.setAttribute("tabindex", "0");
      dayCell.setAttribute("role", "button");
      dayCell.setAttribute(
        "aria-label",
        `${MONTH_NAMES[viewMonth + 1] ?? MONTH_NAMES[0]} ${day}, ${date.getFullYear()}`,
      );

      addTrackedEventListener(dayCell, "click", () => handleDateSelect(date));
      addTrackedEventListener(dayCell, "keydown", (event: Event) => {
        const e = event as KeyboardEvent;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleDateSelect(date);
        }
      });
      grid.appendChild(dayCell);
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

  // Get the cell element as trigger - use getCellId for consistency with body cell IDs
  const cellId = getCellId({ accessor: header.accessor, rowId: cell.rowId });
  const cellElement = document.getElementById(cellId) as HTMLElement;

  // Create and show dropdown
  dropdown = createDropdown(cellElement || document.body, container, {
    width: 240,
    overflow: "hidden",
    positioning: "fixed",
    onClose: onComplete,
  });

  return dropdown;
};
