import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./components/ModernStyles.css";
import Header from "./components/Header";
import BoardList from "./components/BoardList";
import BoardDetails from "./components/BoardDetails";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<BoardList />} />
              <Route path="/boards" element={<BoardList />} />
              <Route path="/boards/:boardId" element={<BoardDetails />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
