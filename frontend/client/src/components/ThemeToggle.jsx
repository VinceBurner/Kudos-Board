import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle modern-button ${className}`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="theme-toggle-icon">{isDark ? "☀️" : "🌙"}</span>
      <span className="theme-toggle-text">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
};

export default ThemeToggle;
