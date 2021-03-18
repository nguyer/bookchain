import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Books from "./Books";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>Backend URL is: {process.env.REACT_APP_BACKEND_URL}</div>
      </header> */}
      <Books />
    </div>
  );
}

export default App;
