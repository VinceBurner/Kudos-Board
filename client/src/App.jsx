import React, { useState } from "react";
import "./App.css";
import "./components/ModernStyles.css";
import Header from "./components/Header";
import BoardList from "./components/BoardList";
import BoardDetails from "./components/BoardDetails";
import Footer from "./components/Footer";

function App() {
  const [currentView, setCurrentView] = useState("list"); // "list" or "details"
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const handleViewDetails = (boardId) => {
    setSelectedBoardId(boardId);
    setCurrentView("details");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedBoardId(null);
  };

  return (
    <div className="App">
      <Header />

      <main className="main-content">
        <div className="container">
          {currentView === "list" ? (
            <BoardList onViewDetails={handleViewDetails} />
          ) : (
            <BoardDetails boardId={selectedBoardId} onBack={handleBackToList} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
