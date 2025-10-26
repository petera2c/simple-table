import { ReactNode } from "react";

interface FooterRendererProps {
  currentPage: number;
  endRow: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextIcon?: ReactNode;
  onNextPage: () => Promise<void>;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  prevIcon?: ReactNode;
  rowsPerPage: number;
  startRow: number;
  totalPages: number;
  totalRows: number;
}

export default FooterRendererProps;
