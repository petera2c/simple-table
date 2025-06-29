import { HEADERS } from "./billing-headers";
import SimpleTable from "../../../components/simple-table/SimpleTable";
import billingData from "./billing-data.json";
import { UniversalTableProps } from "../StoryWrapper";

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
