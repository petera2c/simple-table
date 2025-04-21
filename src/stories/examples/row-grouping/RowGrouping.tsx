import SimpleTable from "../../../components/SimpleTable/SimpleTable";
import { HEADERS } from "../finance-example/finance-headers";
import data from "../finance-example/finance-data.json";

const RowGroupingExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        defaultHeaders={HEADERS}
        rows={data}
        height="calc(100dvh - 112px)"
      />
    </div>
  );
};

export default RowGroupingExample;
