import SimpleTable from "./components/SimpleTable/SimpleTable";
import { sampleData } from "./consts/SampleData";

const App = () => {
  return (
    <div className="app" style={{ padding: "2rem" }}>
      <SimpleTable
        headers={["id", "name", "age", "email", "address"]}
        rows={sampleData}
      />
    </div>
  );
};

export default App;
