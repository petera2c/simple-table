import SimpleTable from "./components/SimpleTable/SimpleTable";
import { sampleData } from "./consts/SampleData";

const HEADERS = [
  { label: "id", accessor: "id" },
  { label: "name", accessor: "name" },
  { label: "age", accessor: "age" },
  { label: "email", accessor: "email" },
  { label: "address", accessor: "address" },
];

const App = () => {
  return (
    <div className="app" style={{ padding: "2rem" }}>
      <SimpleTable headers={HEADERS} rows={sampleData} />
    </div>
  );
};

export default App;
