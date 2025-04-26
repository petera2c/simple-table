import { ReactNode, useState } from "react";
import OnNextPage from "../../types/OnNextPage";
interface TableFooterProps {
  currentPage: number;
  hideFooter?: boolean;
  nextIcon?: ReactNode;
  onPageChange: (page: number) => void;
  onNextPage?: OnNextPage;
  onPreviousPage?: OnNextPage;
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
  prevIcon,
  shouldPaginate,
  totalPages,
}: TableFooterProps) => {
  const [hasMoreData, setHasMoreData] = useState(true);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const isOnLastPage = currentPage === totalPages;

  const isPrevDisabled = !hasPrevPage;

  const isNextDisabled = (!hasNextPage && !onNextPage) || (!hasMoreData && isOnLastPage);

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;

    // Then update the internal page state
    if (prevPage >= 1) {
      onPageChange(prevPage);
    }
  };

  const handleNextPage = async () => {
    const needsMoreData = currentPage === totalPages;
    const nextPage = currentPage + 1;

    // First call the custom handler if provided to fetch data
    if (onNextPage && needsMoreData) {
      const hasMoreData = await onNextPage(currentPage); // Current page is already the index for next page data
      if (!hasMoreData) {
        setHasMoreData(false);
        return;
      }
    }

    // Then update the internal page state
    if (nextPage <= totalPages || onNextPage) {
      onPageChange(nextPage);
    }
  };

  const handlePageChange = (page: number) => {
    // Only update page if within valid range
    if (page >= 1 && page <= totalPages) {
      // Update internal state
      onPageChange(page);
    }
  };

  if (hideFooter || !shouldPaginate) return null;

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
