import React from "react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-text">
            <h1 className="app-title">Kudos Board</h1>
            <p className="app-subtitle">
              Celebrate achievements and recognize great work
            </p>
          </div>
          <div className="header-actions">
            <ThemeToggle className="header-theme-toggle" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
