import { ReactNode } from "react";

interface TableFooterProps {
  currentPage: number;
  hideFooter?: boolean;
  nextIcon?: ReactNode;
  onPageChange: (page: number) => void;
  onNextPage?: (page: number) => void;
  onPreviousPage?: (page: number) => void;
  prevIcon?: ReactNode;
  shouldPaginate?: boolean;
  totalPages: number;
}

const TableFooter = ({
  currentPage,
  hideFooter,
  nextIcon,
  onPageChange,
  onNextPage,
  onPreviousPage,
  prevIcon,
  shouldPaginate,
  totalPages,
}: TableFooterProps) => {
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;

    // First update the internal page state
    if (prevPage >= 1) {
      onPageChange(prevPage);
    }

    // Then call the custom handler if provided to fetch data
    if (onPreviousPage) {
      onPreviousPage(prevPage - 1); // Convert to 0-based for data fetching
    }
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;

    // First update the internal page state
    if (nextPage <= totalPages || onNextPage) {
      onPageChange(nextPage);
    }

    // Then call the custom handler if provided to fetch data
    if (onNextPage) {
      onNextPage(currentPage); // Current page is already the index for next page data
    }
  };

  const handlePageChange = (page: number) => {
    // Only update page if within valid range
    if (page >= 1 && page <= totalPages) {
      // Update internal state
      onPageChange(page);

      // Call appropriate data fetch handler based on direction
      if (page > currentPage && onNextPage) {
        onNextPage(page - 1); // Convert to 0-based for data fetching
      } else if (page < currentPage && onPreviousPage) {
        onPreviousPage(page - 1); // Convert to 0-based for data fetching
      }
    }
  };

  if (hideFooter || !shouldPaginate) return null;

  const isPrevDisabled = !hasPrevPage && !onPreviousPage;
  const isNextDisabled = !hasNextPage && !onNextPage;

  return (
    <div className="st-footer">
      <button
        className={`st-next-prev-btn ${isPrevDisabled ? "disabled" : ""}`}
        onClick={handlePrevPage}
        disabled={isPrevDisabled}
      >
        {prevIcon}
      </button>
      <button
        className={`st-next-prev-btn ${isNextDisabled ? "disabled" : ""}`}
        onClick={handleNextPage}
        disabled={isNextDisabled}
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
