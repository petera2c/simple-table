import SimpleTable from "../../../components/SimpleTable/SimpleTable";
import {
  generateAthletesData,
  ATHLETES_HEADERS,
} from "../../data/athlete-data";

const EXAMPLE_DATA = generateAthletesData();
const HEADERS = ATHLETES_HEADERS;

const RowGroupingExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        defaultHeaders={HEADERS}
        rows={EXAMPLE_DATA}
        height="calc(100dvh - 112px)"
      />
    </div>
  );
};

export default RowGroupingExample;
