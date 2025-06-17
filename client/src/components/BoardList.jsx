import React, { useState, useEffect } from "react";
import BoardCard from "./BoardCard";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    // Update filtered boards when boards change
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      setFilteredBoards(boards);
    }
  }, [boards, searchTerm]);

  if (loading) {
    return <div className="loading">Loading boards...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="board-list">
      <h2>Kudos Boards ({boards.length})</h2>

      {/* Search Area */}
      <div className="search-area">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search boards by title, category, or author..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
          <button onClick={handleClearSearch} className="clear-button">
            Clear
          </button>
        </div>
        {searchTerm && (
          <div className="search-results-info">
            Showing {filteredBoards.length} of {boards.length} boards
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        )}
      </div>

      <div className="boards-grid">
        {/* Create new board card - always first */}
        <BoardCard isCreateCard={true} onCreateNew={handleCreateNew} />

        {/* Existing boards */}
        {(searchTerm ? filteredBoards : boards).map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            onDelete={handleDeleteBoard}
            onCreateNew={handleCreateNew}
            onEdit={handleEditBoard}
          />
        ))}
      </div>

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
