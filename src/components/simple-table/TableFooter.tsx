import { ReactNode, useState } from "react";
import OnNextPage from "../../types/OnNextPage";
import { useTableContext } from "../../context/TableContext";
import FooterRendererProps from "../../types/FooterRendererProps";

interface TableFooterProps {
  currentPage: number;
  footerRenderer?: (props: FooterRendererProps) => ReactNode;
  hideFooter?: boolean;
  nextIcon?: ReactNode;
  onPageChange: (page: number) => void;
  onNextPage?: OnNextPage;
  onPreviousPage?: OnNextPage;
  prevIcon?: ReactNode;
  rowsPerPage: number;
  shouldPaginate?: boolean;
  totalPages: number;
  totalRows: number;
}

const TableFooter = ({
  currentPage,
  footerRenderer,
  hideFooter,
  onPageChange,
  onNextPage,
  rowsPerPage,
  shouldPaginate,
  totalPages,
  totalRows,
}: TableFooterProps) => {
  const { nextIcon, prevIcon } = useTableContext();
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

  // Generate visible page numbers
  const getVisiblePages = () => {
    // If there are 15 or fewer pages, show all
    if (totalPages <= 15) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Otherwise, show a window of pages with focus on the current page
    const pages = [];
    const maxDisplayed = 15; // Show maximum 15 page buttons

    // Calculate how to distribute the page numbers
    let startPage: number;
    let endPage: number;

    if (currentPage <= Math.ceil(maxDisplayed / 2)) {
      // Near the beginning - show first maxDisplayed-1 pages and the last page
      startPage = 1;
      endPage = maxDisplayed - 1;
    } else if (currentPage >= totalPages - Math.floor(maxDisplayed / 2)) {
      // Near the end - show last maxDisplayed pages
      startPage = Math.max(1, totalPages - maxDisplayed + 1);
      endPage = totalPages;
    } else {
      // In the middle - show a window around current page
      const pagesBeforeCurrent = Math.floor((maxDisplayed - 1) / 2);
      const pagesAfterCurrent = maxDisplayed - pagesBeforeCurrent - 1;
      startPage = currentPage - pagesBeforeCurrent;
      endPage = currentPage + pagesAfterCurrent;
    }

    // Add pages in the primary range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if not already included
    if (endPage < totalPages - 1) {
      pages.push(-1); // Ellipsis
      pages.push(totalPages);
    }

    return pages;
  };

  if (hideFooter || !shouldPaginate) return null;

  // Use custom footer renderer if provided
  if (footerRenderer) {
    const startRow = Math.min((currentPage - 1) * rowsPerPage + 1, totalRows);
    const endRow = Math.min(currentPage * rowsPerPage, totalRows);

    return (
      <>
        {footerRenderer({
          currentPage,
          totalPages,
          rowsPerPage,
          totalRows,
          startRow,
          endRow,
          onPageChange,
          onNextPage: handleNextPage,
          onPrevPage: handlePrevPage,
          hasNextPage: !isNextDisabled,
          hasPrevPage: !isPrevDisabled,
          nextIcon,
          prevIcon,
        })}
      </>
    );
  }

  // Default footer
  const visiblePages = getVisiblePages();

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

      {visiblePages.map((page, index) =>
        page < 0 ? (
          // Render ellipsis
          <span key={`ellipsis-${page}`} className="st-page-ellipsis">
            ...
          </span>
        ) : (
          // Render page button
          <button
            key={`page-${page}`}
            onClick={() => handlePageChange(page)}
            className={`st-page-btn ${currentPage === page ? "active" : ""}`}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};

export default TableFooter;
