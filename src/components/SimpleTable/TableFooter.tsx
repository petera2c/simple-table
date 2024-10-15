import React, { ReactNode } from "react";
import AngleLeftIcon from "../../icons/AngleLeftIcon";
import AngleRightIcon from "../../icons/AngleRightIcon";

interface TableFooterProps {
  currentPage: number;
  hideFooter?: boolean;
  nextIcon?: ReactNode;
  onPageChange: (page: number) => void;
  prevIcon?: ReactNode;
  rowsPerPage: number;
  totalRows: number;
}

const TableFooter = ({
  currentPage,
  hideFooter,
  nextIcon,
  onPageChange,
  prevIcon,
  rowsPerPage,
  totalRows,
}: TableFooterProps) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (hideFooter) return null;

  return (
    <div className="st-footer">
      <button
        className="st-next-prev-btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {prevIcon}
      </button>
      <button
        className="st-next-prev-btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {nextIcon}
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`st-page-btn ${currentPage === index + 1 ? "active" : ""}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default TableFooter;
