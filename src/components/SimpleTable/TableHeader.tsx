import React from "react";

interface TableHeaderProps {
  headers: string[];
  onSort: (columnIndex: number) => void;
}

const TableHeader = ({ headers, onSort }: TableHeaderProps) => {
  return (
    <thead className="table-header">
      <tr>
        {headers.map((header, index) => (
          <th
            className="table-header-cell"
            key={index}
            onClick={() => onSort(index)} // Added onClick handler
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
