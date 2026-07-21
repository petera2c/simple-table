import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import { RowManager } from "../managers/RowManager";
interface CalculateAggregatedRowsProps {
    rows?: Row[];
    headers?: HeaderObject[];
    rowGrouping?: string[];
    rowManager?: RowManager;
}
/**
 * Pure function to calculate aggregated rows based on row grouping and aggregation configuration
 */
export declare const calculateAggregatedRows: (props: CalculateAggregatedRowsProps) => Row[];
export default calculateAggregatedRows;
