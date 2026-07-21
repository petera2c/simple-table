import { QuickFilterConfig } from "../types/QuickFilterTypes";
import Row from "../types/Row";
import HeaderObject from "../types/HeaderObject";
interface FilterRowsWithQuickFilterProps {
    rows: Row[];
    headers: HeaderObject[];
    quickFilter?: QuickFilterConfig;
}
/**
 * Pure function to filter rows based on quick filter configuration
 * Supports both simple (contains) and smart (multi-word, phrases, negation, column-specific) modes
 */
export declare const filterRowsWithQuickFilter: ({ rows, headers, quickFilter }: FilterRowsWithQuickFilterProps) => Row[];
export default filterRowsWithQuickFilter;
