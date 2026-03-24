const PREV_ICON_SVG = `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
</svg>`;

const NEXT_ICON_SVG = `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
</svg>`;

export interface CreateDatePickerOptions {
  onChange: (date: Date) => void;
  onClose?: () => void;
  value: Date;
}

export const createDatePicker = (options: CreateDatePickerOptions) => {
  let { onChange, onClose, value } = options;

  let currentDate = value || new Date();
  let currentView: "days" | "months" | "years" = "days";

  const container = document.createElement("div");
  container.className = "st-datepicker";

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleString("default", { month: "long" });
  };

  const handlePrevMonth = () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    render();
  };

  const handleNextMonth = () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    render();
  };

  const handleYearChange = (year: number) => {
    currentDate = new Date(year, currentDate.getMonth(), 1);
    currentView = "months";
    render();
  };

  const handleMonthChange = (month: number) => {
    currentDate = new Date(currentDate.getFullYear(), month, 1);
    currentView = "days";
    render();
  };

  const handleDateSelect = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const newDate = new Date(year, month, day, 12, 0, 0);
    currentDate = newDate;
    onChange(newDate);
    onClose?.();
  };

  const handlePrevMonthDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day, 12, 0, 0);
    currentDate = newDate;
    onChange(newDate);
    onClose?.();
  };

  const handleNextMonthDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day, 12, 0, 0);
    currentDate = newDate;
    onChange(newDate);
    onClose?.();
  };

  const renderDays = (gridContainer: HTMLElement) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    weekdays.forEach((day) => {
      const weekdayDiv = document.createElement("div");
      weekdayDiv.className = "st-datepicker-weekday";
      weekdayDiv.textContent = day;
      gridContainer.appendChild(weekdayDiv);
    });

    for (let i = 0; i < firstDay; i++) {
      const prevMonthDay = daysInPrevMonth - firstDay + i + 1;
      const dayDiv = document.createElement("div");
      dayDiv.className = "st-datepicker-day other-month";
      dayDiv.textContent = prevMonthDay.toString();
      dayDiv.addEventListener("click", () => handlePrevMonthDateSelect(prevMonthDay));
      gridContainer.appendChild(dayDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      const valueDate = new Date(value);
      const isSelected =
        day === valueDate.getDate() &&
        month === valueDate.getMonth() &&
        year === valueDate.getFullYear();

      const dayDiv = document.createElement("div");
      dayDiv.className = `st-datepicker-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`.trim();
      dayDiv.textContent = day.toString();
      dayDiv.addEventListener("click", () => handleDateSelect(day));
      gridContainer.appendChild(dayDiv);
    }

    const remainingCells = 35 - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "st-datepicker-day other-month";
      dayDiv.textContent = day.toString();
      dayDiv.addEventListener("click", () => handleNextMonthDateSelect(day));
      gridContainer.appendChild(dayDiv);
    }
  };

  const renderMonths = (gridContainer: HTMLElement) => {
    const monthNames = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString("default", { month: "short" })
    );

    monthNames.forEach((month, index) => {
      const isCurrentMonth = index === currentDate.getMonth();
      const monthDiv = document.createElement("div");
      monthDiv.className = `st-datepicker-month ${isCurrentMonth ? "selected" : ""}`.trim();
      monthDiv.textContent = month;
      monthDiv.addEventListener("click", () => handleMonthChange(index));
      gridContainer.appendChild(monthDiv);
    });
  };

  const renderYears = (gridContainer: HTMLElement) => {
    const currentYear = currentDate.getFullYear();
    const startYear = currentYear - 6;

    for (let year = startYear; year < startYear + 12; year++) {
      const isCurrentYear = year === currentYear;
      const yearDiv = document.createElement("div");
      yearDiv.className = `st-datepicker-year ${isCurrentYear ? "selected" : ""}`.trim();
      yearDiv.textContent = year.toString();
      yearDiv.addEventListener("click", () => handleYearChange(year));
      gridContainer.appendChild(yearDiv);
    }
  };

  const render = () => {
    container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "st-datepicker-header";

    if (currentView === "days") {
      const prevBtn = document.createElement("button");
      prevBtn.className = "st-datepicker-nav-btn";
      prevBtn.innerHTML = PREV_ICON_SVG;
      prevBtn.addEventListener("click", handlePrevMonth);

      const label = document.createElement("div");
      label.className = "st-datepicker-header-label";
      label.textContent = `${formatMonth(currentDate)} ${currentDate.getFullYear()}`;
      label.addEventListener("click", () => {
        currentView = "months";
        render();
      });

      const nextBtn = document.createElement("button");
      nextBtn.className = "st-datepicker-nav-btn";
      nextBtn.innerHTML = NEXT_ICON_SVG;
      nextBtn.addEventListener("click", handleNextMonth);

      header.appendChild(prevBtn);
      header.appendChild(label);
      header.appendChild(nextBtn);
    } else if (currentView === "months") {
      const label = document.createElement("div");
      label.className = "st-datepicker-header-label";
      label.textContent = currentDate.getFullYear().toString();
      label.addEventListener("click", () => {
        currentView = "years";
        render();
      });
      header.appendChild(label);
    } else {
      const label = document.createElement("div");
      label.className = "st-datepicker-header-label";
      label.textContent = "Select Year";
      header.appendChild(label);
    }

    container.appendChild(header);

    const grid = document.createElement("div");
    grid.className = `st-datepicker-grid st-datepicker-${currentView}-grid`;

    if (currentView === "days") {
      renderDays(grid);
    } else if (currentView === "months") {
      renderMonths(grid);
    } else {
      renderYears(grid);
    }

    container.appendChild(grid);

    const footer = document.createElement("div");
    footer.className = "st-datepicker-footer";

    const todayBtn = document.createElement("button");
    todayBtn.className = "st-datepicker-today-btn";
    todayBtn.textContent = "Today";
    todayBtn.addEventListener("click", () => {
      const today = new Date();
      const todayAtNoon = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        12,
        0,
        0
      );
      currentDate = todayAtNoon;
      onChange(todayAtNoon);
      onClose?.();
    });

    footer.appendChild(todayBtn);
    container.appendChild(footer);
  };

  render();

  const update = (newOptions: Partial<CreateDatePickerOptions>) => {
    if (newOptions.value !== undefined) {
      value = newOptions.value;
      currentDate = value || new Date();
      render();
    }
    if (newOptions.onChange !== undefined) {
      onChange = newOptions.onChange;
    }
    if (newOptions.onClose !== undefined) {
      onClose = newOptions.onClose;
    }
  };

  const destroy = () => {
    container.remove();
  };

  return { element: container, update, destroy };
};
