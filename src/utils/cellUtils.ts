import HeaderObject from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { RowId } from "../types/RowId";

export const getCellId = ({ accessor, rowIndex }: { accessor: string; rowIndex: number }) => {
  return `cell-${accessor}-${rowIndex}`;
};

export const displayCell = ({ header, pinned }: { header: HeaderObject; pinned?: Pinned }) => {
  if (header.hide) return null;
  else if ((pinned || header.pinned) && header.pinned !== pinned) return null;
  return true;
};

export const getCellKey = ({ rowId, accessor }: { rowId: RowId; accessor: string }) => {
  return `${rowId}-${accessor}`;
};
