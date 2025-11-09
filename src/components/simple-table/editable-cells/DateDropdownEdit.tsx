import React, { useEffect } from "react";
import Dropdown from "../../dropdown/Dropdown";
import { DatePicker } from "../../LazyComponents";
import CellValue from "../../../types/CellValue";
import { parseDateString } from "../../../utils/dateUtils";

// Convert the input value to a Date object
const parseDate = (value: CellValue): Date => {
  if (!value) return new Date();
  return parseDateString(value.toString());
};
interface DateDropdownEditProps {
  onBlur: () => void;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  value: CellValue;
}

const DateDropdownEdit = ({ onBlur, onChange, open, setOpen, value }: DateDropdownEditProps) => {
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
    // format date as yyyy-mm-dd
    const formattedDate = newDate.toISOString().split("T")[0];
    onChange(formattedDate);
    setOpen(false);
    onBlur();
  };

  const handleClose = () => {
    onBlur();
  };

  return (
    <Dropdown open={open} onClose={handleClose} setOpen={setOpen} width={280}>
      <DatePicker value={parseDate(value)} onChange={handleDateChange} onClose={handleClose} />
    </Dropdown>
  );
};

export default DateDropdownEdit;
