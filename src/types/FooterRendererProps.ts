import type { IconElement } from "./IconsConfig";

interface FooterRendererProps {
  currentPage: number;
  endRow: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextIcon?: IconElement;
  onNextPage: () => Promise<void>;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  prevIcon?: IconElement;
  rowsPerPage: number;
  startRow: number;
  totalPages: number;
  totalRows: number;
}

export default FooterRendererProps;
