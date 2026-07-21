import { Pinned } from "./Pinned";
/**
 * State for individual rows during expansion/loading
 */
interface RowState {
    loading?: boolean;
    error?: string | null;
    isEmpty?: boolean;
    emptyMessage?: string;
    triggerSection?: Pinned;
}
export default RowState;
