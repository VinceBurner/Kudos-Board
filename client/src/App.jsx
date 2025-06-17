import React from "react";
import "./App.css";
import Header from "./components/Header";
import BoardList from "./components/BoardList";

function App() {
  return (
    <div className="App">
      <Header />

      <main className="main-content">
        <div className="container">
          <BoardList />
        </div>
      </main>
    </div>
  );
}

export default App;
