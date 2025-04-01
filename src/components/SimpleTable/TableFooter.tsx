import { ReactNode } from "react";

interface TableFooterProps {
  currentPage: number;
  hideFooter?: boolean;
  nextIcon?: ReactNode;
  onPageChange: (page: number) => void;
  prevIcon?: ReactNode;
  rowsPerPage: number;
  shouldPaginate?: boolean;
  totalRows: number;
}

const TableFooter = ({
  currentPage,
  hideFooter,
  nextIcon,
  onPageChange,
  prevIcon,
  rowsPerPage,
  shouldPaginate,
  totalRows,
}: TableFooterProps) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (hideFooter || !shouldPaginate) return null;

  return (
    <div className="st-footer">
      <button
        className={`st-next-prev-btn ${!hasPrevPage ? "disabled" : ""}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        {prevIcon}
      </button>
      <button
        className={`st-next-prev-btn ${!hasNextPage ? "disabled" : ""}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
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
