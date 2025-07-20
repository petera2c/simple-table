import HeaderObject, { Accessor } from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { RowId } from "../types/RowId";

export const getCellId = ({ accessor, rowId }: { accessor: Accessor; rowId: RowId }) => {
  return `${rowId}-${accessor}`;
};

export const displayCell = ({ header, pinned }: { header: HeaderObject; pinned?: Pinned }) => {
  if (header.hide) return null;
  else if ((pinned || header.pinned) && header.pinned !== pinned) return null;
  return true;
};

export const getCellKey = ({ rowId, accessor }: { rowId: RowId; accessor: Accessor }) => {
  return `${rowId}-${accessor}`;
};
