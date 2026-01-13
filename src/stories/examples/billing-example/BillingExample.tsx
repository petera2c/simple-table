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
      columnReordering
      columnResizing
      defaultHeaders={HEADERS}
      editColumns
      height={"70dvh"}
      initialSortColumn="amount" // Show highest amounts first
      initialSortDirection="desc"
      onGridReady={() => {}}
      rowGrouping={["invoices", "charges"]}
      // @ts-ignore
      rows={billingData}
      selectableCells
      theme={props.theme}
      useOddColumnBackground
    />
  );
};

export default BillingExample;
