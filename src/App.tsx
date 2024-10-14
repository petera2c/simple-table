import SimpleTable from "./components/SimpleTable/SimpleTable";
import { sampleData } from "./consts/SampleData";
import HeaderObject from "./types/HeaderObject";

const HEADERS: HeaderObject[] = [
  { label: "id", accessor: "id", width: 100 },
  { label: "name", accessor: "name", width: 100 },
  { label: "age", accessor: "age", width: 100 },
  { label: "email", accessor: "email", width: 100 },
  { label: "address", accessor: "address", width: 100 },
];

const App = () => {
  return (
    <div className="app" style={{ padding: "2rem" }}>
      <SimpleTable defaultHeaders={HEADERS} rows={sampleData} />
    </div>
  );
};

export default App;
