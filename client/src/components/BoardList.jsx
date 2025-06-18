import React, { useState, useEffect } from "react";
import SearchArea from "./SearchArea";
import FilterButtons from "./FilterButtons";
import CategoryGroupView from "./CategoryGroupView";
import BoardGrid from "./BoardGrid";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreateCard, setShowCreateCard] = useState(true);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/boards");

      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }

      const boardsData = await response.json();
      setBoards(boardsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this board? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/boards/${boardId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete board");
      }

      // Remove the deleted board from the local state
      setBoards(boards.filter((board) => board.id !== boardId));
    } catch (err) {
      alert(`Error deleting board: ${err.message}`);
    }
  };

  const handleCreateNew = (newBoard) => {
    // Add the new board to the local state
    setBoards((prevBoards) => [...prevBoards, newBoard]);
  };

  const handleEditBoard = (updatedBoard) => {
    // Update the board in the local state
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === updatedBoard.id ? updatedBoard : board
      )
    );
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredBoards(boards);
      return;
    }

    const filtered = boards.filter(
      (board) =>
        board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        board.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        board.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBoards(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredBoards(boards);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setSearchTerm(""); // Clear search when changing filters

    if (filter === "all") {
      setFilteredBoards(boards);
      setShowCreateCard(true);
    } else if (filter === "recent") {
      // Show boards created in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentBoards = boards.filter((board) => {
        const boardDate = new Date(board.createdAt);
        return boardDate >= sevenDaysAgo;
      });

      setFilteredBoards(recentBoards);
      setShowCreateCard(true);
    } else if (filter === "create") {
      // Hide all boards, show only create card
      setFilteredBoards([]);
      setShowCreateCard(true);
    } else if (filter === "category") {
      // Group by category - we'll handle this in the display logic
      setFilteredBoards(boards);
      setShowCreateCard(true);
    }
  };

  const getDisplayBoards = () => {
    if (searchTerm.trim()) {
      return filteredBoards;
    }

    if (activeFilter === "all") {
      return boards;
    } else if (activeFilter === "recent") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return boards.filter((board) => {
        const boardDate = new Date(board.createdAt);
        return boardDate >= sevenDaysAgo;
      });
    } else if (activeFilter === "create") {
      return [];
    } else if (activeFilter === "category") {
      return boards;
    }

    return boards;
  };

  const getGroupedBoards = () => {
    const boardsToGroup = getDisplayBoards();
    const grouped = {};

    boardsToGroup.forEach((board) => {
      const category = board.category || "Uncategorized";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(board);
    });

    // Sort categories alphabetically and sort boards within each category by creation date (newest first)
    const sortedGrouped = {};
    Object.keys(grouped)
      .sort()
      .forEach((category) => {
        sortedGrouped[category] = grouped[category].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      });

    return sortedGrouped;
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    // Update filtered boards when boards change
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      handleFilterChange(activeFilter);
    }
  }, [boards]);

  useEffect(() => {
    // Update filtered boards when search term changes
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      handleFilterChange(activeFilter);
    }
  }, [searchTerm]);

  if (loading) {
    return <div className="loading">Loading boards...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="board-list">
      <h2>Kudos Boards ({boards.length})</h2>

      <SearchArea
        searchTerm={searchTerm}
        onSearchInputChange={handleSearchInputChange}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        filteredBoards={filteredBoards}
        totalBoards={boards.length}
        activeFilter={activeFilter}
        getDisplayBoards={getDisplayBoards}
        getGroupedBoards={getGroupedBoards}
      />

      <FilterButtons
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {activeFilter === "category" && !searchTerm ? (
        <CategoryGroupView
          showCreateCard={showCreateCard}
          onCreateNew={handleCreateNew}
          groupedBoards={getGroupedBoards()}
          onDeleteBoard={handleDeleteBoard}
          onEditBoard={handleEditBoard}
        />
      ) : (
        <BoardGrid
          showCreateCard={showCreateCard}
          onCreateNew={handleCreateNew}
          displayBoards={getDisplayBoards()}
          onDeleteBoard={handleDeleteBoard}
          onEditBoard={handleEditBoard}
        />
      )}

      {boards.length === 0 && (
        <div className="no-boards-message">
          <p>
            No boards created yet. Use the card above to create your first
            board!
          </p>
        </div>
      )}

      {searchTerm && filteredBoards.length === 0 && boards.length > 0 && (
        <div className="no-search-results">
          <p>No boards found matching "{searchTerm}"</p>
          <button onClick={handleClearSearch} className="clear-search-button">
            Show All Boards
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardList;
