import { useMemo } from "react";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import { flattenAllHeaders } from "../utils/headerUtils";

/**
 * Creates a memoized O(1) lookup map for headers by accessor
 * @param headers The headers array to create lookup from
 * @returns Map of accessor to HeaderObject
 */
const useHeaderLookup = (headers: HeaderObject[]): Map<Accessor, HeaderObject> => {
  return useMemo(() => {
    const allHeaders = flattenAllHeaders(headers);
    const lookupMap = new Map<Accessor, HeaderObject>();

    allHeaders.forEach((header) => {
      lookupMap.set(header.accessor, header);
    });

    return lookupMap;
  }, [headers]);
};

export default useHeaderLookup;
