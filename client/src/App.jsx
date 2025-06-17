import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import BoardForm from "./components/BoardForm";
import BoardList from "./components/BoardList";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBoardCreated = (newBoard) => {
    // Trigger a refresh of the board list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="App">
      <Header />

      <main className="main-content">
        <div className="container">
          <BoardForm onBoardCreated={handleBoardCreated} />
          <BoardList refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
}

export default App;
