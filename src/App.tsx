import SimpleTable from "./components/SimpleTable/SimpleTable";
import { sampleData } from "./consts/SampleData";
import HeaderObject from "./types/HeaderObject";

const HEADERS: HeaderObject[] = [
  { label: "id", accessor: "id", width: "100px" },
  { label: "name", accessor: "name", width: "150px" },
  { label: "age", accessor: "age", width: "80px" },
  { label: "email", accessor: "email", width: "200px" },
  { label: "address", accessor: "address", width: "250px" },
];

const App = () => {
  return (
    <div className="app" style={{ padding: "2rem" }}>
      <SimpleTable headers={HEADERS} rows={sampleData} />
    </div>
  );
};

export default App;
