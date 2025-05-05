import React, { useState, ReactNode } from "react";
import "./datepicker.css";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onClose?: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, onClose }) => {
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
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setCurrentDate(newDate);
    onChange(newDate);
    onClose?.();
  };

  // Render days view
  const renderDays = () => {
    const days: ReactNode[] = [];
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    // Add weekday headers
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    weekdays.forEach((day, index) => {
      days.push(
        <div key={`header-${index}`} className="st-datepicker-weekday">
          {day}
        </div>
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="st-datepicker-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      const isSelected =
        day === value.getDate() &&
        currentDate.getMonth() === value.getMonth() &&
        currentDate.getFullYear() === value.getFullYear();

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
              &lt;
            </button>
            <div className="st-datepicker-header-label" onClick={() => setCurrentView("months")}>
              {formatMonth(currentDate)} {currentDate.getFullYear()}
            </div>
            <button onClick={handleNextMonth} className="st-datepicker-nav-btn">
              &gt;
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
            setCurrentDate(today);
            onChange(today);
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
