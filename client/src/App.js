import React, { useState, useEffect } from "react";
import Uploadimage from "./Uploadimage";
import GetFiles from "./GetFiles";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p>
        <Uploadimage />
        <GetFiles />
      </header>
    </div>
  );
}

export default App;
