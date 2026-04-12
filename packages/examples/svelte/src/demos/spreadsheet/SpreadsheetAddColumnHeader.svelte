<script lang="ts">
  import { addSpreadsheetColumnFromHeader } from "./spreadsheet-add-header-handler";
</script>

<div style="display: flex; justify-content: center;">
  <button
    type="button"
    style="color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 500; white-space: nowrap; background: #3b82f6;"
    onclick={addSpreadsheetColumnFromHeader}
  >
    + Add Column
  </button>
</div>
