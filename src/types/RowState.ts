import { Pinned } from "./Pinned";

/**
 * State for individual rows during expansion/loading
 */
interface RowState {
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  // Track which section (pinned left/right or main) triggered the state
  // This determines where to display the state indicator
  triggerSection?: Pinned;
}

export default RowState;
