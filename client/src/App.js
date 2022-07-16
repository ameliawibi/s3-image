import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);

  /*useEffect(() => {
    axios.get("/api").then((res) => setData(res.data.message));
  }, []);
  */

  useEffect(() => {
    axios.get("/getuser").then((res) => setData(res.data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
