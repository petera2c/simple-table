import ColumnDef from "../types/ColumnDef";
import { Pinned } from "../types/Pinned";
import { isHeaderExcludedFromLayout } from "./cellUtils";

// Deep clone function that preserves functions
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone) as unknown as T;
  }

  const clonedObj = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

export const canDisplaySection = (headers: ColumnDef[], pinned?: Pinned) => {
  return headers
    .filter((header) => header.pinned === pinned)
    .some((header) => !isHeaderExcludedFromLayout(header));
};
