import React from "react";

const CategoryFilter = ({ activeFilter, onFilterChange, boardCounts }) => {
  const filterOptions = [
    { key: "all", label: "All", count: boardCounts.all },
    { key: "recent", label: "Recent", count: boardCounts.recent },
    {
      key: "celebration",
      label: "Celebration",
      count: boardCounts.celebration,
    },
    { key: "thank you", label: "Thank You", count: boardCounts.thankYou },
    {
      key: "inspiration",
      label: "Inspiration",
      count: boardCounts.inspiration,
    },
  ];

  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <div className="filter-buttons">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            className={`filter-button modern-button ${
              activeFilter === option.key ? "active primary" : "secondary"
            }`}
            onClick={() => onFilterChange(option.key)}
          >
            <span className="button-icon">
              {option.key === "all" && "📋"}
              {option.key === "recent" && "🕒"}
              {option.key === "celebration" && "🎉"}
              {option.key === "thank you" && "🙏"}
              {option.key === "inspiration" && "💡"}
            </span>
            {option.label}
            {option.count !== undefined && (
              <span className="filter-count">({option.count})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
