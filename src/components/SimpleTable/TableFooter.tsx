import React from "react";
import AngleLeftIcon from "../../icons/AngleLeftIcon";
import AngleRightIcon from "../../icons/AngleRightIcon";

interface TableFooterProps {
  currentPage: number;
  hideFooter?: boolean;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  totalRows: number;
}

const TableFooter: React.FC<TableFooterProps> = ({
  currentPage,
  hideFooter,
  onPageChange,
  rowsPerPage,
  totalRows,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (hideFooter) return null;

  return (
    <div className="table-footer">
      <button
        className="st-next-prev-btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <AngleLeftIcon />
      </button>
      <button
        className="st-next-prev-btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <AngleRightIcon />
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
