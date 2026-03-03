import HeaderObject, { Accessor } from "../types/HeaderObject";
import { flattenAllHeaders } from "../utils/headerUtils";

/**
 * Creates an O(1) lookup map for headers by accessor.
 * This is a pure function that replaces the useHeaderLookup hook.
 * 
 * @param headers - The headers array to create lookup from
 * @returns Map of accessor to HeaderObject
 */
export function createHeaderLookup(headers: HeaderObject[]): Map<Accessor, HeaderObject> {
  const allHeaders = flattenAllHeaders(headers);
  const lookupMap = new Map<Accessor, HeaderObject>();

  allHeaders.forEach((header) => {
    lookupMap.set(header.accessor, header);
  });

  return lookupMap;
}

export default createHeaderLookup;
