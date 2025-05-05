import React, { useEffect, useState } from "react";
import { Dropdown } from "../../dropdown";
import { DatePicker } from "../../date-picker";

interface DateDropdownEditProps {
  onBlur: () => void;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string | Date; // Can accept ISO string or Date object
}

const DateDropdownEdit: React.FC<DateDropdownEditProps> = ({
  onBlur,
  onChange,
  open,
  setOpen,
  value,
}) => {
  // Convert the input value to a Date object
  const parseDate = (value: string | Date): Date => {
    if (value instanceof Date) {
      return value;
    }

    const parsedDate = new Date(value);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  };

  const [currentDate, setCurrentDate] = useState<Date>(parseDate(value));

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
    setOpen(false);
    onBlur();
  };

  const handleClose = () => {
    onBlur();
  };

  return (
    <Dropdown
      open={open}
      onClose={handleClose}
      position="bottom-left"
      setOpen={setOpen}
      width={280}
    >
      <DatePicker value={currentDate} onChange={handleDateChange} onClose={handleClose} />
    </Dropdown>
  );
};

export default DateDropdownEdit;
