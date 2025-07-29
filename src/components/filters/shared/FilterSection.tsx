import { ReactNode } from "react";

interface FilterSectionProps {
  children: ReactNode;
  className?: string;
}

const FilterSection = ({ children, className = "" }: FilterSectionProps) => {
  return <div className={`st-filter-section ${className}`.trim()}>{children}</div>;
};

export default FilterSection;
