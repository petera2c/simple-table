import Spreadsheet from "./components/Spreadsheet/Spreadsheet";
import { sampleData } from "./consts/SampleData";

const App = () => {
  return (
    <div className="app" style={{ padding: "2rem" }}>
      <Spreadsheet
        headers={["id", "name", "age", "email", "address"]}
        rows={sampleData}
      />
    </div>
  );
};

export default App;
