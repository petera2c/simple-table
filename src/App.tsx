import Spreadsheet from "./components/Spreadsheet/Spreadsheet";
import { sampleData } from "./consts/SampleData";

const App = () => {
  return (
    <Spreadsheet
      headers={["id", "name", "age", "email", "address"]}
      rows={sampleData}
    />
  );
};

export default App;
