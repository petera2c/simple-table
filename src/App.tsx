import SimpleTable from "./components/SimpleTable/SimpleTable";
import { sampleData } from "./consts/SampleData";
import HeaderObject from "./types/HeaderObject";

const HEADERS: HeaderObject[] = [
  { label: "id", accessor: "id", width: 1000 },
  { label: "name", accessor: "name", width: 20 },
  { label: "age", accessor: "age", width: 20 },
  { label: "email", accessor: "email", width: 20 },
  { label: "address", accessor: "address", width: 20 },
];

const App = () => {
  return (
    <div className="app" style={{ padding: "2rem" }}>
      <SimpleTable headers={HEADERS} rows={sampleData} />
    </div>
  );
};

export default App;
