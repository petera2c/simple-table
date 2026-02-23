import HeaderObject, { Accessor } from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { RowId } from "../types/RowId";
import { shouldHideWhenParentCollapsed } from "./collapseUtils";

export const getCellId = ({ accessor, rowId }: { accessor: Accessor; rowId: RowId }) => {
  return `${rowId}-${accessor}`;
};

export const displayCell = ({
  header,
  pinned,
  headers,
  collapsedHeaders,
  rootPinned,
}: {
  header: HeaderObject;
  pinned?: Pinned;
  headers?: HeaderObject[];
  collapsedHeaders?: Set<Accessor>;
  rootPinned?: Pinned;
}) => {
  // Check if manually hidden or excluded from render
  if (header.hide || header.excludeFromRender || rootPinned !== pinned) return null;

  // Check if parent is collapsed and this child should be hidden
  if (
    headers &&
    collapsedHeaders &&
    shouldHideWhenParentCollapsed(header, headers, collapsedHeaders)
  ) {
    return null;
  }

  return true;
};

export const getCellKey = ({ rowId, accessor }: { rowId: RowId; accessor: Accessor }) => {
  return `${rowId}-${accessor}`;
};
