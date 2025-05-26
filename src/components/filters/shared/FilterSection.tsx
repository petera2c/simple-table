import React, { ReactNode } from "react";

interface FilterSectionProps {
  children: ReactNode;
  className?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({ children, className = "" }) => {
  return <div className={`st-filter-section ${className}`.trim()}>{children}</div>;
};

export default FilterSection;
