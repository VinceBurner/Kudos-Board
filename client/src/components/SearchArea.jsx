import React from "react";

const SearchArea = ({
  searchTerm,
  onSearchInputChange,
  onSearch,
  onClearSearch,
  filteredBoards,
  totalBoards,
  activeFilter,
  getDisplayBoards,
  getGroupedBoards,
}) => {
  return (
    <div className="search-area">
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search boards by title, category, or author..."
          value={searchTerm}
          onChange={onSearchInputChange}
          className="search-input"
        />
        <button onClick={onSearch} className="search-button">
          Search
        </button>
        <button onClick={onClearSearch} className="clear-button">
          Clear
        </button>
      </div>

      {searchTerm && (
        <div className="search-results-info">
          Showing {filteredBoards.length} of {totalBoards} boards
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      )}

      {activeFilter === "recent" && !searchTerm && (
        <div className="filter-info">
          Showing boards created in the last 7 days ({getDisplayBoards().length}{" "}
          boards)
        </div>
      )}

      {activeFilter === "create" && !searchTerm && (
        <div className="filter-info">
          Create mode - Focus on adding new boards
        </div>
      )}

      {activeFilter === "category" && !searchTerm && (
        <div className="filter-info">
          Boards grouped by category ({Object.keys(getGroupedBoards()).length}{" "}
          categories)
        </div>
      )}
    </div>
  );
};

export default SearchArea;
