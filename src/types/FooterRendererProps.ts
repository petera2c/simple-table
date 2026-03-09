interface FooterRendererProps {
  currentPage: number;
  endRow: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextIcon?: any;
  onNextPage: () => Promise<void>;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  prevIcon?: any;
  rowsPerPage: number;
  startRow: number;
  totalPages: number;
  totalRows: number;
}

export default FooterRendererProps;
