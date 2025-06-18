import React from "react";

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="filter-buttons">
      <button
        className={`filter-button ${activeFilter === "all" ? "active" : ""}`}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>
      <button
        className={`filter-button ${activeFilter === "recent" ? "active" : ""}`}
        onClick={() => onFilterChange("recent")}
      >
        Recent
      </button>
      <button
        className={`filter-button ${
          activeFilter === "category" ? "active" : ""
        }`}
        onClick={() => onFilterChange("category")}
      >
        By Category
      </button>
      <button
        className={`filter-button create-filter ${
          activeFilter === "create" ? "active" : ""
        }`}
        onClick={() => onFilterChange("create")}
      >
        Create a New Board
      </button>
    </div>
  );
};

export default FilterButtons;
