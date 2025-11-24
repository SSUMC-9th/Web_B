import { useState } from "react";
import "./App.css";
import UseReducerPage from "./pages/UseReducerPage";
import UseReducerCompany from "./pages/UseReducerCompany";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <UseReducerPage /> */}
      <UseReducerCompany />
    </>
  );
}

export default App;
