import React from "react";
import "./App.css";
import Header from "./components/Header";
import BoardList from "./components/BoardList";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />

      <main className="main-content">
        <div className="container">
          <BoardList />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
