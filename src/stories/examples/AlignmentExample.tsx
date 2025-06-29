import SimpleTable from "../../components/simple-table/SimpleTable";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";
import { generateRetailSalesData } from "../data/retail-data";
import { UniversalTableProps } from "./StoryWrapper";

const EXAMPLE_DATA = generateRetailSalesData();
const HEADERS = RETAIL_SALES_HEADERS;

const AlignmentExample = (props: UniversalTableProps) => {
  return (
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      rows={EXAMPLE_DATA}
      rowGrouping={["stores"]}
      rowIdAccessor="id"
      height={props.height ?? "calc(100dvh - 112px)"}
    />
  );
};

export default AlignmentExample;
