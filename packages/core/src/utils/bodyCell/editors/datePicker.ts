// Date picker editor (calendar-based date selection)

import { AbsoluteBodyCell, CellRenderContext } from "../types";
import { setNestedValue } from "../../rowUtils";
import { createDropdown } from "./dropdown";
import { addTrackedEventListener } from "../eventTracking";
import { parseDateString } from "../../dateUtils";
import { createAngleLeftIcon, createAngleRightIcon } from "../../../icons";
import type { IconElement } from "../../../types/IconsConfig";

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

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Day names (short to match CSS layout)
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const createDatePicker = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  currentValue: any,
  onComplete: () => void,
  triggerElement?: HTMLElement,
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
  let currentView: "days" | "months" | "years" = "days";

  // Create date picker container (match CSS: .st-datepicker)
  const container = document.createElement("div");
  container.className = "st-datepicker";

  const prevIconSource = context.icons.prev ?? createAngleLeftIcon("st-next-prev-icon");
  const nextIconSource = context.icons.next ?? createAngleRightIcon("st-next-prev-icon");

  const appendIcon = (button: HTMLElement, icon: IconElement) => {
    if (typeof icon === "string") {
      button.innerHTML = icon;
    } else {
      button.appendChild(icon.cloneNode(true));
    }
  };

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
    container.innerHTML = "";

    const headerEl = document.createElement("div");
    headerEl.className = "st-datepicker-header";

    if (currentView === "days") {
      const prevButton = document.createElement("button");
      prevButton.className = "st-datepicker-nav-btn";
      prevButton.setAttribute("aria-label", "Previous month");
      appendIcon(prevButton, prevIconSource);
      addTrackedEventListener(prevButton, "click", () => {
        viewMonth--;
        if (viewMonth < 0) {
          viewMonth = 11;
          viewYear--;
        }
        renderCalendar();
      });

      const monthYearLabel = document.createElement("div");
      monthYearLabel.className = "st-datepicker-header-label";
      monthYearLabel.setAttribute("role", "button");
      monthYearLabel.setAttribute("tabindex", "0");
      monthYearLabel.setAttribute("aria-label", "Select month");
      monthYearLabel.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
      const openMonths = () => {
        currentView = "months";
        renderCalendar();
      };
      addTrackedEventListener(monthYearLabel, "click", openMonths);
      addTrackedEventListener(monthYearLabel, "keydown", (event: Event) => {
        const e = event as KeyboardEvent;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openMonths();
        }
      });

      const nextButton = document.createElement("button");
      nextButton.className = "st-datepicker-nav-btn";
      nextButton.setAttribute("aria-label", "Next month");
      appendIcon(nextButton, nextIconSource);
      addTrackedEventListener(nextButton, "click", () => {
        viewMonth++;
        if (viewMonth > 11) {
          viewMonth = 0;
          viewYear++;
        }
        renderCalendar();
      });

      headerEl.appendChild(prevButton);
      headerEl.appendChild(monthYearLabel);
      headerEl.appendChild(nextButton);
    } else if (currentView === "months") {
      const yearLabel = document.createElement("div");
      yearLabel.className = "st-datepicker-header-label";
      yearLabel.setAttribute("role", "button");
      yearLabel.setAttribute("tabindex", "0");
      yearLabel.setAttribute("aria-label", "Select year");
      yearLabel.textContent = String(viewYear);
      const openYears = () => {
        currentView = "years";
        renderCalendar();
      };
      addTrackedEventListener(yearLabel, "click", openYears);
      addTrackedEventListener(yearLabel, "keydown", (event: Event) => {
        const e = event as KeyboardEvent;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openYears();
        }
      });
      headerEl.appendChild(yearLabel);
    } else {
      const selectYearLabel = document.createElement("div");
      selectYearLabel.className = "st-datepicker-header-label";
      selectYearLabel.textContent = "Select Year";
      headerEl.appendChild(selectYearLabel);
    }

    container.appendChild(headerEl);

    const grid = document.createElement("div");
    grid.className = `st-datepicker-grid st-datepicker-${currentView}-grid`;

    if (currentView === "days") {
      DAY_NAMES.forEach((day) => {
        const dayHeader = document.createElement("div");
        dayHeader.className = "st-datepicker-weekday";
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
      });

      const daysInMonth = getDaysInMonth(viewYear, viewMonth);
      const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
      const daysInPrevMonth = getDaysInMonth(viewYear, viewMonth - 1);
      const today = new Date();

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
          `${MONTH_NAMES[date.getMonth()]} ${prevMonthDay}, ${date.getFullYear()}`,
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
          `${MONTH_NAMES[date.getMonth()]} ${day}, ${date.getFullYear()}`,
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
    } else if (currentView === "months") {
      MONTH_NAMES_SHORT.forEach((month, index) => {
        const monthCell = document.createElement("div");
        monthCell.className = `st-datepicker-month${index === viewMonth ? " selected" : ""}`;
        monthCell.textContent = month;
        monthCell.setAttribute("tabindex", "0");
        monthCell.setAttribute("role", "button");
        monthCell.setAttribute("aria-label", MONTH_NAMES[index]);
        const selectMonth = () => {
          viewMonth = index;
          currentView = "days";
          renderCalendar();
        };
        addTrackedEventListener(monthCell, "click", selectMonth);
        addTrackedEventListener(monthCell, "keydown", (event: Event) => {
          const e = event as KeyboardEvent;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectMonth();
          }
        });
        grid.appendChild(monthCell);
      });
    } else {
      const startYear = viewYear - 6;
      for (let year = startYear; year < startYear + 12; year++) {
        const yearCell = document.createElement("div");
        yearCell.className = `st-datepicker-year${year === viewYear ? " selected" : ""}`;
        yearCell.textContent = String(year);
        yearCell.setAttribute("tabindex", "0");
        yearCell.setAttribute("role", "button");
        yearCell.setAttribute("aria-label", String(year));
        const selectYear = () => {
          viewYear = year;
          currentView = "months";
          renderCalendar();
        };
        addTrackedEventListener(yearCell, "click", selectYear);
        addTrackedEventListener(yearCell, "keydown", (event: Event) => {
          const e = event as KeyboardEvent;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectYear();
          }
        });
        grid.appendChild(yearCell);
      }
    }

    container.appendChild(grid);

    const footer = document.createElement("div");
    footer.className = "st-datepicker-footer";

    const todayBtn = document.createElement("button");
    todayBtn.className = "st-datepicker-today-btn";
    todayBtn.textContent = "Today";
    addTrackedEventListener(todayBtn, "click", () => {
      const today = new Date();
      const noon = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
      handleDateSelect(noon);
    });
    footer.appendChild(todayBtn);
    container.appendChild(footer);
  };

  // Initial render
  renderCalendar();

  dropdown = createDropdown(triggerElement ?? document.body, container, {
    width: 280,
    overflow: "hidden",
    positioning: "fixed",
    onClose: onComplete,
  });

  return dropdown;
};
