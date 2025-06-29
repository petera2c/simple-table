import { HEADERS } from "./billing-headers";
import SimpleTable from "../../../components/simple-table/SimpleTable";
import billingData from "./billing-data.json";
import { UniversalTableProps } from "../StoryWrapper";

// Default args specific to BillingExample - exported for reuse in stories and tests
export const billingExampleDefaults = {
  useOddColumnBackground: true,
  useHoverRowBackground: false,
  height: "90dvh",
  editColumns: true,
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
};

const BillingExample = (props: UniversalTableProps) => {
  return (
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      rowGrouping={["invoices", "charges"]}
      rowIdAccessor="id"
      rows={billingData}
      // Default settings for this example, but allow override
      useOddColumnBackground={props.useOddColumnBackground ?? true}
      useHoverRowBackground={props.useHoverRowBackground ?? false}
      height={props.height ?? "90dvh"}
    />
  );
};

export default BillingExample;
