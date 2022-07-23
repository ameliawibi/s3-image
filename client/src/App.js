import React, { useState, useEffect } from "react";
import Uploadimage from "./Uploadimage";
import GetFile from "./GetFile";
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
        <GetFile />
        <GetFiles />
      </header>
    </div>
  );
}

export default App;
