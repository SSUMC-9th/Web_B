import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Counter from "./components/Counter";
import RandomNumberGenerator from "./components/RandomNumberGenerator";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 100,
      }}
    >
      <Counter />
      <RandomNumberGenerator />
    </div>
  );
}

export default App;
