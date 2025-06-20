import React, { useState, useEffect, useCallback } from "react";
import BoardCard from "./BoardCard";
import CategoryFilter from "./CategoryFilter";
import GifSearchModal from "./GifSearchModal";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    author: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");
  const [isGifSearchOpen, setIsGifSearchOpen] = useState(false);

  const fetchBoards = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/boards`);

      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }

      const boardsData = await response.json();
      setBoards(boardsData);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

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
        `${process.env.REACT_APP_API_URL}/api/boards/${boardId}`,
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

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCreateError("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create board");
      }

      const newBoard = await response.json();

      // Add the new board to the local state
      setBoards((prevBoards) => [...prevBoards, newBoard]);

      // Reset form and close
      setFormData({
        title: "",
        description: "",
        category: "",
        author: "",
        image: "",
      });
      setShowCreateForm(false);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setFormData({
      title: "",
      description: "",
      category: "",
      author: "",
      image: "",
    });
    setCreateError("");
  };

  const handleCreateNew = (newBoard) => {
    // Add the new board to the local state (for compatibility with BoardCard)
    setBoards((prevBoards) => [...prevBoards, newBoard]);
  };

  const handleGifSelect = (gifUrl) => {
    setFormData({
      ...formData,
      image: gifUrl,
    });
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
    } else if (activeFilter === "celebration") {
      return boards.filter((board) => board.category === "celebration");
    } else if (activeFilter === "thank you") {
      return boards.filter((board) => board.category === "thank you");
    } else if (activeFilter === "inspiration") {
      return boards.filter((board) => board.category === "inspiration");
    }

    return boards;
  };

  const getBoardCounts = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return {
      all: boards.length,
      recent: boards.filter((board) => {
        const boardDate = new Date(board.createdAt);
        return boardDate >= sevenDaysAgo;
      }).length,
      celebration: boards.filter((board) => board.category === "celebration")
        .length,
      thankYou: boards.filter((board) => board.category === "thank you").length,
      inspiration: boards.filter((board) => board.category === "inspiration")
        .length,
    };
  };

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // Real-time updates with polling
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchBoards(false); // Don't show loading spinner for polling
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [fetchBoards]);

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
          <button
            onClick={handleSearch}
            className="search-button modern-button primary"
          >
            <span className="button-icon">🔍</span>
            Search
          </button>
          <button
            onClick={handleClearSearch}
            className="clear-button modern-button secondary"
          >
            <span className="button-icon">✕</span>
            Clear
          </button>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          boardCounts={getBoardCounts()}
        />

        {searchTerm && (
          <div className="search-results-info">
            Showing {filteredBoards.length} of {boards.length} boards
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        )}

        {activeFilter === "recent" && !searchTerm && (
          <div className="filter-info">
            Showing boards created in the last 7 days (
            {getDisplayBoards().length} boards)
          </div>
        )}

        {activeFilter === "create" && !searchTerm && (
          <div className="filter-info">
            Create mode - Focus on adding new boards
          </div>
        )}

        {/* Create New Board Button */}
        <div className="create-board-section">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="create-board-button modern-button primary"
            >
              <span className="button-icon">✨</span>
              Create New Board
            </button>
          ) : (
            <div className="create-board-form modern-form">
              <div className="form-header">
                <h3>
                  <span className="form-icon">🎯</span>
                  Create New Kudos Board
                </h3>
                <p className="form-subtitle">
                  Start building recognition and appreciation
                </p>
              </div>
              <form onSubmit={handleCreateSubmit} className="board-form">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Board title"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="celebration">Celebration</option>
                      <option value="thank you">Thank You</option>
                      <option value="inspiration">Inspiration</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Board description (required)"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleFormChange}
                      placeholder="Your name (optional)"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      placeholder="Board GIF/image URL (required)"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIsGifSearchOpen(true)}
                      className="search-gif-button"
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                      title="Search for GIFs"
                    >
                      🔍 Search for GIFs
                    </button>
                  </div>
                </div>

                {createError && (
                  <div className="error-message">{createError}</div>
                )}

                <div className="form-buttons">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-button modern-button primary"
                  >
                    <span className="button-icon">
                      {isSubmitting ? "⏳" : "🎯"}
                    </span>
                    {isSubmitting ? "Creating..." : "Create Board"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelCreate}
                    className="cancel-button modern-button secondary"
                  >
                    <span className="button-icon">✕</span>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="boards-grid">
        {/* Existing boards */}
        {getDisplayBoards().map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            onDelete={handleDeleteBoard}
            onCreateNew={handleCreateNew}
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

      <GifSearchModal
        isOpen={isGifSearchOpen}
        onClose={() => setIsGifSearchOpen(false)}
        onSelectGif={handleGifSelect}
      />
    </div>
  );
};

export default BoardList;
