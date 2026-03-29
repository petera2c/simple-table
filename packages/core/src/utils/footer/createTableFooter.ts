import OnNextPage from "../../types/OnNextPage";

const PREV_ICON_SVG = `<svg
  viewBox="0 0 24 24"
  width="24"
  height="24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
</svg>`;

const NEXT_ICON_SVG = `<svg
  viewBox="0 0 24 24"
  width="24"
  height="24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
</svg>`;

export interface CreateTableFooterOptions {
  currentPage: number;
  hideFooter?: boolean;
  onPageChange: (page: number) => void;
  onNextPage?: OnNextPage;
  onUserPageChange?: (page: number) => void | Promise<void>;
  rowsPerPage: number;
  shouldPaginate?: boolean;
  totalPages: number;
  totalRows: number;
  /** Custom icon for previous page button (string = HTML, HTMLElement = node to clone/append). */
  prevIcon?: string | HTMLElement | SVGSVGElement;
  /** Custom icon for next page button. */
  nextIcon?: string | HTMLElement | SVGSVGElement;
}

const getVisiblePages = (currentPage: number, totalPages: number): number[] => {
  if (totalPages <= 15) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: number[] = [];
  const maxDisplayed = 15;

  let startPage: number;
  let endPage: number;

  if (currentPage <= Math.ceil(maxDisplayed / 2)) {
    startPage = 1;
    endPage = maxDisplayed - 1;
  } else if (currentPage >= totalPages - Math.floor(maxDisplayed / 2)) {
    startPage = Math.max(1, totalPages - maxDisplayed + 1);
    endPage = totalPages;
  } else {
    const pagesBeforeCurrent = Math.floor((maxDisplayed - 1) / 2);
    const pagesAfterCurrent = maxDisplayed - pagesBeforeCurrent - 1;
    startPage = currentPage - pagesBeforeCurrent;
    endPage = currentPage + pagesAfterCurrent;
  }

  if (startPage > 2) {
    pages.push(1);
    pages.push(-1);
  } else if (startPage === 2) {
    pages.push(1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    pages.push(-2);
    pages.push(totalPages);
  } else if (endPage === totalPages - 1) {
    pages.push(totalPages);
  }

  return pages;
};

const setButtonIcon = (btn: HTMLButtonElement, icon: string | HTMLElement | SVGSVGElement): void => {
  if (typeof icon === "string") {
    btn.innerHTML = icon;
  } else {
    btn.innerHTML = "";
    btn.appendChild(icon.cloneNode(true));
  }
};

export const createTableFooter = (options: CreateTableFooterOptions) => {
  let {
    currentPage,
    hideFooter,
    onPageChange,
    onNextPage,
    onUserPageChange,
    rowsPerPage,
    shouldPaginate,
    totalPages,
    totalRows,
    prevIcon,
    nextIcon,
  } = options;

  let hasMoreData = true;

  if (hideFooter || !shouldPaginate) {
    const emptyDiv = document.createElement("div");
    return {
      element: emptyDiv,
      update: () => {},
      destroy: () => {},
    };
  }

  const container = document.createElement("div");
  container.className = "st-footer";

  const render = () => {
    container.innerHTML = "";

    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;
    const isOnLastPage = currentPage === totalPages;
    const startRow = Math.min((currentPage - 1) * rowsPerPage + 1, totalRows);
    const endRow = Math.min(currentPage * rowsPerPage, totalRows);

    const isPrevDisabled = !hasPrevPage;
    const isNextDisabled = (!hasNextPage && !onNextPage) || (!hasMoreData && isOnLastPage);

    const infoDiv = document.createElement("div");
    infoDiv.className = "st-footer-info";

    const resultsText = document.createElement("span");
    resultsText.className = "st-footer-results-text";
    resultsText.textContent = `Showing ${startRow} to ${endRow} of ${totalRows.toLocaleString()} results`;
    infoDiv.appendChild(resultsText);

    container.appendChild(infoDiv);

    const paginationDiv = document.createElement("div");
    paginationDiv.className = "st-footer-pagination";

    const handlePrevPage = async () => {
      const prevPage = currentPage - 1;

      if (prevPage >= 1) {
        onPageChange(prevPage);
        if (onUserPageChange) {
          await onUserPageChange(prevPage);
        }
      }
    };

    const handleNextPage = async () => {
      const needsMoreData = currentPage === totalPages;
      const nextPage = currentPage + 1;

      if (onNextPage && needsMoreData) {
        const hasMore = await onNextPage(currentPage);
        if (!hasMore) {
          hasMoreData = false;
          render();
          return;
        }
      }

      if (nextPage <= totalPages || onNextPage) {
        onPageChange(nextPage);
        if (onUserPageChange) {
          await onUserPageChange(nextPage);
        }
      }
    };

    const handlePageChange = async (page: number) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        if (onUserPageChange) {
          await onUserPageChange(page);
        }
      }
    };

    const visiblePages = getVisiblePages(currentPage, totalPages);

    visiblePages.forEach((page, index) => {
      if (page < 0) {
        const ellipsis = document.createElement("span");
        ellipsis.className = "st-page-ellipsis";
        ellipsis.textContent = "...";
        paginationDiv.appendChild(ellipsis);
      } else {
        const pageBtn = document.createElement("button");
        pageBtn.className = `st-page-btn ${currentPage === page ? "active" : ""}`;
        pageBtn.textContent = page.toString();
        pageBtn.setAttribute("aria-label", `Go to page ${page}`);
        if (currentPage === page) {
          pageBtn.setAttribute("aria-current", "page");
        }
        pageBtn.addEventListener("click", () => handlePageChange(page));
        paginationDiv.appendChild(pageBtn);
      }
    });

    const prevBtn = document.createElement("button");
    prevBtn.className = `st-next-prev-btn ${isPrevDisabled ? "disabled" : ""}`;
    prevBtn.disabled = isPrevDisabled;
    prevBtn.setAttribute("aria-label", "Go to previous page");
    if (prevIcon) setButtonIcon(prevBtn, prevIcon);
    else prevBtn.innerHTML = PREV_ICON_SVG;
    prevBtn.addEventListener("click", handlePrevPage);
    paginationDiv.appendChild(prevBtn);

    const nextBtn = document.createElement("button");
    nextBtn.className = `st-next-prev-btn ${isNextDisabled ? "disabled" : ""}`;
    nextBtn.disabled = isNextDisabled;
    nextBtn.setAttribute("aria-label", "Go to next page");
    if (nextIcon) setButtonIcon(nextBtn, nextIcon);
    else nextBtn.innerHTML = NEXT_ICON_SVG;
    nextBtn.addEventListener("click", handleNextPage);
    paginationDiv.appendChild(nextBtn);

    container.appendChild(paginationDiv);
  };

  render();

  const update = (newOptions: Partial<CreateTableFooterOptions>) => {
    if (newOptions.currentPage !== undefined) currentPage = newOptions.currentPage;
    if (newOptions.hideFooter !== undefined) hideFooter = newOptions.hideFooter;
    if (newOptions.onPageChange !== undefined) onPageChange = newOptions.onPageChange;
    if (newOptions.onNextPage !== undefined) onNextPage = newOptions.onNextPage;
    if (newOptions.onUserPageChange !== undefined) onUserPageChange = newOptions.onUserPageChange;
    if (newOptions.rowsPerPage !== undefined) rowsPerPage = newOptions.rowsPerPage;
    if (newOptions.shouldPaginate !== undefined) shouldPaginate = newOptions.shouldPaginate;
    if (newOptions.totalPages !== undefined) totalPages = newOptions.totalPages;
    if (newOptions.totalRows !== undefined) totalRows = newOptions.totalRows;
    if (newOptions.prevIcon !== undefined) prevIcon = newOptions.prevIcon;
    if (newOptions.nextIcon !== undefined) nextIcon = newOptions.nextIcon;

    if (hideFooter || !shouldPaginate) {
      container.style.display = "none";
    } else {
      container.style.display = "flex";
      render();
    }
  };

  const destroy = () => {
    container.remove();
  };

  return { element: container, update, destroy };
};
