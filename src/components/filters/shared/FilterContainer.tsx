import React, { ReactNode } from "react";

interface FilterContainerProps {
  children: ReactNode;
}

const FilterContainer: React.FC<FilterContainerProps> = ({ children }) => {
  return <div className="st-filter-container">{children}</div>;
};

export default FilterContainer;
