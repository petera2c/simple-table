import HeaderObject from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { RowId } from "../types/RowId";

export const getCellId = ({ accessor, rowIndex }: { accessor: string; rowIndex: number }) => {
  return `cell-${accessor}-${rowIndex}`;
};

export const displayCell = ({
  hiddenColumns,
  header,
  pinned,
}: {
  hiddenColumns: Record<string, boolean>;
  header: HeaderObject;
  pinned?: Pinned;
}) => {
  if (hiddenColumns[header.accessor]) return null;
  else if ((pinned || header.pinned) && header.pinned !== pinned) return null;
  return true;
};

export const getCellKey = ({ rowId, accessor }: { rowId: RowId; accessor: string }) => {
  return `${rowId}-${accessor}`;
};
