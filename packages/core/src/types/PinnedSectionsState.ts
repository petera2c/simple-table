import { Accessor } from "./ColumnDef";

export type PinnedSectionsState = {
  left: Accessor[];
  main: Accessor[];
  right: Accessor[];
};
