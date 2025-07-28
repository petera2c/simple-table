import HeaderObject from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";

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

export const canDisplaySection = <T>(headers: HeaderObject<T>[], pinned?: Pinned) => {
  return headers.filter((header) => header.pinned === pinned).some((header) => !header.hide);
};
