import HeaderObject from "../types/HeaderObject";

export const getCellId = ({
  accessor,
  rowIndex,
}: {
  accessor: string;
  rowIndex: number;
}) => {
  return `cell-${accessor}-${rowIndex}`;
};

export const displayCell = ({
  hiddenColumns,
  header,
  pinned,
}: {
  hiddenColumns: Record<string, boolean>;
  header: HeaderObject;
  pinned?: "left" | "right";
}) => {
  if (hiddenColumns[header.accessor]) return null;
  else if ((pinned || header.pinned) && header.pinned !== pinned) return null;
  return true;
};
