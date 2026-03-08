import React from "react";
import { HEADERS } from "./billing-headers";
import { SimpleTable } from "../../..";
import billingData from "./billing-data.json";
import { UniversalTableProps } from "../StoryWrapper";
import Row from "../../../types/Row";

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
      enableStickyParents
      defaultHeaders={HEADERS}
      height={"70dvh"}
      rowGrouping={["invoices", "charges"]}
      rows={billingData as Row[]}
      theme={props.theme}
    />
  );
};

export default BillingExample;
