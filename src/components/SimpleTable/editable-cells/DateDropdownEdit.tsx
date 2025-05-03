import React, { useEffect, useState } from "react";
import { Dropdown } from "../../Dropdown";
import { DatePicker } from "../../DatePicker";

interface DateDropdownEditProps {
  value: string | Date; // Can accept ISO string or Date object
  onChange: (value: string) => void;
  onBlur: () => void;
}

const DateDropdownEdit: React.FC<DateDropdownEditProps> = ({ value, onChange, onBlur }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Convert the input value to a Date object
  const parseDate = (value: string | Date): Date => {
    if (value instanceof Date) {
      return value;
    }

    const parsedDate = new Date(value);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  };

  const [currentDate, setCurrentDate] = useState<Date>(parseDate(value));

  // Format the date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };

  // Auto-focus on mount
  useEffect(() => {
    // Set focus to the dropdown container
    const timerId = setTimeout(() => {
      const dropdownContainer = document.querySelector(".st-dropdown-container");
      if (dropdownContainer instanceof HTMLElement) {
        dropdownContainer.focus();
      }
    }, 0);

    return () => clearTimeout(timerId);
  }, []);

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    // Format the date as ISO string for storage
    onChange(newDate.toISOString());
    setIsOpen(false);
    onBlur();
  };

  const handleClose = () => {
    onBlur();
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={handleClose}
      trigger={<div className="st-date-dropdown-trigger">{formatDate(currentDate)}</div>}
      position="bottom-left"
      width={280}
    >
      <DatePicker value={currentDate} onChange={handleDateChange} onClose={handleClose} />
    </Dropdown>
  );
};

export default DateDropdownEdit;
