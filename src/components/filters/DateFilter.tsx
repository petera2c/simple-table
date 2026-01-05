import React, { useState, useEffect, useRef } from "react";
import HeaderObject from "../../types/HeaderObject";
import {
  FilterCondition,
  DateFilterOperator,
  getAvailableOperators,
  requiresSingleValue,
  requiresMultipleValues,
  requiresNoValue,
} from "../../types/FilterTypes";
import FilterContainer from "./shared/FilterContainer";
import OperatorSelector from "./shared/OperatorSelector";
import FilterSection from "./shared/FilterSection";
import FilterActions from "./shared/FilterActions";
import { DatePicker } from "../LazyComponents";
import { createSafeDate } from "../../utils/dateUtils";
import Dropdown from "../dropdown/Dropdown";

interface DateFilterProps {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  header,
  currentFilter,
  onApplyFilter,
  onClearFilter,
}) => {
  const [selectedOperator, setSelectedOperator] = useState<DateFilterOperator>(
    (currentFilter?.operator as DateFilterOperator) || "equals"
  );
  const [filterValue, setFilterValue] = useState<string>(
    currentFilter?.value ? String(currentFilter.value) : ""
  );
  const [filterValueFrom, setFilterValueFrom] = useState<string>(
    currentFilter?.values?.[0] ? String(currentFilter.values[0]) : ""
  );
  const [filterValueTo, setFilterValueTo] = useState<string>(
    String(currentFilter?.values?.[1] || "")
  );

  const availableOperators = getAvailableOperators("date") as DateFilterOperator[];

  // Reset form when current filter changes
  useEffect(() => {
    if (currentFilter) {
      setSelectedOperator(currentFilter.operator as DateFilterOperator);
      setFilterValue(String(currentFilter.value || ""));
      setFilterValueFrom(String(currentFilter.values?.[0] || ""));
      setFilterValueTo(String(currentFilter.values?.[1] || ""));
    } else {
      setSelectedOperator("equals");
      setFilterValue("");
      setFilterValueFrom("");
      setFilterValueTo("");
    }
  }, [currentFilter]);

  const handleApplyFilter = () => {
    const filter: FilterCondition = {
      accessor: header.accessor,
      operator: selectedOperator,
    };

    if (requiresSingleValue(selectedOperator)) {
      filter.value = filterValue;
    } else if (requiresMultipleValues(selectedOperator)) {
      filter.values = [filterValueFrom, filterValueTo];
    }

    onApplyFilter(filter);
  };

  const canApply = () => {
    if (requiresNoValue(selectedOperator)) return true;
    if (requiresSingleValue(selectedOperator)) return filterValue.trim() !== "";
    if (requiresMultipleValues(selectedOperator)) {
      return filterValueFrom.trim() !== "" && filterValueTo.trim() !== "";
    }
    return false;
  };

  // Custom DateInput component that wraps the DatePicker
  interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    autoFocus?: boolean;
    className?: string;
  }

  const DateInput: React.FC<DateInputProps> = ({
    value,
    onChange,
    placeholder,
    autoFocus,
    className,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Update display value when value changes
    useEffect(() => {
      if (value) {
        const date = createSafeDate(value);
        if (!isNaN(date.getTime())) {
          setDisplayValue(
            date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          );
        }
      } else {
        setDisplayValue("");
      }
    }, [value]);

    // Auto focus if requested
    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus]);

    const handleDateChange = (date: Date) => {
      const isoString = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      onChange(isoString);
      setIsOpen(false);
    };

    const handleInputClick = () => {
      setIsOpen(!isOpen);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const currentDate = value ? createSafeDate(value) : new Date();

    return (
      <div className="st-date-input-container" style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          onClick={handleInputClick}
          onKeyDown={handleInputKeyDown}
          readOnly
          className={`st-filter-input ${className || ""}`}
          style={{ cursor: "pointer" }}
        />
        <Dropdown
          open={isOpen}
          setOpen={setIsOpen}
          onClose={handleClose}
          positioning="absolute"
          overflow="hidden"
          width={240}
        >
          <DatePicker
            value={currentDate}
            onChange={handleDateChange}
            onClose={() => setIsOpen(false)}
          />
        </Dropdown>
      </div>
    );
  };

  return (
    <FilterContainer>
      <OperatorSelector
        value={selectedOperator}
        onChange={setSelectedOperator}
        operators={availableOperators}
      />

      {requiresSingleValue(selectedOperator) && (
        <FilterSection>
          <DateInput
            value={filterValue}
            onChange={setFilterValue}
            placeholder="Select date..."
            autoFocus
          />
        </FilterSection>
      )}

      {requiresMultipleValues(selectedOperator) && (
        <FilterSection>
          <DateInput
            value={filterValueFrom}
            onChange={setFilterValueFrom}
            placeholder="From date..."
            autoFocus
            className="st-filter-input-range-from"
          />
          <DateInput value={filterValueTo} onChange={setFilterValueTo} placeholder="To date..." />
        </FilterSection>
      )}

      <FilterActions
        onApply={handleApplyFilter}
        onClear={onClearFilter}
        canApply={canApply()}
        showClear={!!currentFilter}
      />
    </FilterContainer>
  );
};

export default DateFilter;
