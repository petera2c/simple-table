import { useState, ReactNode } from "react";
import { useTableContext } from "../../context/TableContext";

interface DatePickerProps {
  onChange: (date: Date) => void;
  onClose?: () => void;
  value: Date;
}

const DatePicker = ({ onChange, onClose, value }: DatePickerProps) => {
  const { nextIcon, prevIcon } = useTableContext();
  console.log("nextIcon", nextIcon);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [currentView, setCurrentView] = useState<"days" | "months" | "years">("days");

  // Helper functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Format functions
  const formatMonth = (date: Date) => {
    return date.toLocaleString("default", { month: "long" });
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setCurrentView("months");
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setCurrentView("days");
  };

  const handleDateSelect = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // Create date at noon to avoid timezone edge cases
    const newDate = new Date(year, month, day, 12, 0, 0);
    setCurrentDate(newDate);
    onChange(newDate);
    onClose?.();
  };

  const handlePrevMonthDateSelect = (day: number) => {
    // Create date at noon to avoid timezone edge cases
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day, 12, 0, 0);
    setCurrentDate(newDate);
    onChange(newDate);
    onClose?.();
  };

  const handleNextMonthDateSelect = (day: number) => {
    // Create date at noon to avoid timezone edge cases
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day, 12, 0, 0);
    setCurrentDate(newDate);
    onChange(newDate);
    onClose?.();
  };

  // Render days view
  const renderDays = () => {
    const days: ReactNode[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Calculate days from previous month to display
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    // Add weekday headers
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    weekdays.forEach((day, index) => {
      days.push(
        <div key={`header-${index}`} className="st-datepicker-weekday">
          {day}
        </div>
      );
    });

    // Add days from previous month
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDay = daysInPrevMonth - firstDay + i + 1;
      days.push(
        <div
          key={`prev-${prevMonthDay}`}
          className="st-datepicker-day other-month"
          onClick={() => handlePrevMonthDateSelect(prevMonthDay)}
        >
          {prevMonthDay}
        </div>
      );
    }

    // Add days of the current month
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

      days.push(
        <div
          key={`day-${day}`}
          className={`st-datepicker-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }

    // Calculate how many more days we need to add to make a grid with 5 rows (5*7=35)
    // We already added firstDay + daysInMonth cells
    const remainingCells = 35 - (firstDay + daysInMonth);

    // Add days from next month to fill the grid
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="st-datepicker-day other-month"
          onClick={() => handleNextMonthDateSelect(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Render months view
  const renderMonths = () => {
    const months: ReactNode[] = [];
    const monthNames = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString("default", { month: "short" })
    );

    monthNames.forEach((month, index) => {
      const isCurrentMonth = index === currentDate.getMonth();
      months.push(
        <div
          key={`month-${index}`}
          className={`st-datepicker-month ${isCurrentMonth ? "selected" : ""}`}
          onClick={() => handleMonthChange(index)}
        >
          {month}
        </div>
      );
    });

    return months;
  };

  // Render years view
  const renderYears = () => {
    const years: ReactNode[] = [];
    const currentYear = currentDate.getFullYear();
    const startYear = currentYear - 6;

    for (let year = startYear; year < startYear + 12; year++) {
      const isCurrentYear = year === currentYear;
      years.push(
        <div
          key={`year-${year}`}
          className={`st-datepicker-year ${isCurrentYear ? "selected" : ""}`}
          onClick={() => handleYearChange(year)}
        >
          {year}
        </div>
      );
    }

    return years;
  };

  return (
    <div className="st-datepicker">
      <div className="st-datepicker-header">
        {currentView === "days" && (
          <>
            <button onClick={handlePrevMonth} className="st-datepicker-nav-btn">
              {prevIcon}
            </button>
            <div className="st-datepicker-header-label" onClick={() => setCurrentView("months")}>
              {formatMonth(currentDate)} {currentDate.getFullYear()}
            </div>
            <button onClick={handleNextMonth} className="st-datepicker-nav-btn">
              {nextIcon}
            </button>
          </>
        )}
        {currentView === "months" && (
          <div className="st-datepicker-header-label" onClick={() => setCurrentView("years")}>
            {currentDate.getFullYear()}
          </div>
        )}
        {currentView === "years" && <div className="st-datepicker-header-label">Select Year</div>}
      </div>

      <div className={`st-datepicker-grid st-datepicker-${currentView}-grid`}>
        {currentView === "days" && renderDays()}
        {currentView === "months" && renderMonths()}
        {currentView === "years" && renderYears()}
      </div>

      <div className="st-datepicker-footer">
        <button
          className="st-datepicker-today-btn"
          onClick={() => {
            const today = new Date();
            // Create today's date at noon to avoid timezone edge cases
            const todayAtNoon = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              12,
              0,
              0
            );
            setCurrentDate(todayAtNoon);
            onChange(todayAtNoon);
            onClose?.();
          }}
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
