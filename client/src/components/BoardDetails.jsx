import React, { useState, useEffect, useCallback } from "react";

const BoardDetails = ({ boardId, onBack }) => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    message: "",
    author: "",
  });
  const [upvotingCards, setUpvotingCards] = useState(new Set());

  const fetchBoard = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }
        const response = await fetch(
          `http://localhost:5000/api/boards/${boardId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch board details");
        }

        const boardData = await response.json();
        setBoard(boardData);
        setError(""); // Clear any previous errors
      } catch (err) {
        setError(err.message);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [boardId]
  );

  const handleAddCard = async (e) => {
    e.preventDefault();

    if (!newCard.message.trim() || !newCard.author.trim()) {
      return;
    }

    try {
      // Create a new kudos card with upvotes initialized to 0
      const updatedKudos = [
        ...board.kudos,
        {
          id: Date.now(),
          message: newCard.message,
          author: newCard.author,
          upvotes: 0,
          createdAt: new Date().toISOString(),
        },
      ];

      const response = await fetch(
        `http://localhost:5000/api/boards/${boardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...board,
            kudos: updatedKudos,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add card");
      }

      const updatedBoard = await response.json();
      setBoard(updatedBoard);
      setNewCard({ message: "", author: "" });
      setShowAddCardForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpvoteCard = async (cardId) => {
    if (upvotingCards.has(cardId)) {
      return; // Prevent multiple simultaneous upvotes
    }

    try {
      setUpvotingCards((prev) => new Set(prev).add(cardId));

      const response = await fetch(
        `http://localhost:5000/api/boards/${boardId}/cards/${cardId}/upvote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upvote card");
      }

      const result = await response.json();
      setBoard(result.board);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpvotingCards((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) {
      return;
    }

    try {
      const updatedKudos = board.kudos.filter((card) => card.id !== cardId);

      const response = await fetch(
        `http://localhost:5000/api/boards/${boardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...board,
            kudos: updatedKudos,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      const updatedBoard = await response.json();
      setBoard(updatedBoard);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (boardId) {
      fetchBoard();
    }
  }, [boardId, fetchBoard]);

  // Real-time updates with polling
  useEffect(() => {
    if (!boardId) return;

    const pollInterval = setInterval(() => {
      fetchBoard(false); // Don't show loading spinner for polling
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [boardId, fetchBoard]);

  if (loading) {
    return <div className="loading">Loading board details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">Error: {error}</div>
        <button onClick={onBack} className="back-button">
          Back to Boards
        </button>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="error-container">
        <div className="error-message">Board not found</div>
        <button onClick={onBack} className="back-button">
          Back to Boards
        </button>
      </div>
    );
  }

  return (
    <div className="board-details">
      <div className="board-details-header">
        <button onClick={onBack} className="back-button">
          ← Back to Boards
        </button>
        <h1>{board.title}</h1>
      </div>

      <div className="board-info-section">
        <div className="board-meta">
          <div className="meta-item">
            <span className="meta-label">Category:</span>
            <span className="meta-value">{board.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created by:</span>
            <span className="meta-value">{board.author}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created:</span>
            <span className="meta-value">{formatDate(board.createdAt)}</span>
          </div>
          {board.updatedAt && (
            <div className="meta-item">
              <span className="meta-label">Updated:</span>
              <span className="meta-value">{formatDate(board.updatedAt)}</span>
            </div>
          )}
        </div>

        {board.description && (
          <div className="board-description">
            <h3>Description</h3>
            <p>{board.description}</p>
          </div>
        )}

        {board.image && (
          <div className="board-image">
            <img src={board.image} alt={board.title} />
          </div>
        )}
      </div>

      <div className="cards-section">
        <div className="cards-header">
          <h2>Kudos Cards ({board.kudos.length})</h2>
          <button
            onClick={() => setShowAddCardForm(true)}
            className="add-card-button modern-button primary"
          >
            <span className="button-icon">✨</span>
            Add Kudos Card
          </button>
        </div>

        {showAddCardForm && (
          <div className="add-card-form modern-form">
            <div className="form-header">
              <h3>
                <span className="form-icon">💝</span>
                Add New Kudos Card
              </h3>
              <p className="form-subtitle">
                Share your appreciation and recognition
              </p>
            </div>
            <form onSubmit={handleAddCard} className="kudos-form">
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  <span className="label-icon">💬</span>
                  Your Kudos Message
                </label>
                <textarea
                  id="message"
                  value={newCard.message}
                  onChange={(e) =>
                    setNewCard({ ...newCard, message: e.target.value })
                  }
                  placeholder="Write a heartfelt message of appreciation..."
                  required
                  rows="4"
                  className="modern-textarea"
                />
              </div>
              <div className="form-group">
                <label htmlFor="author" className="form-label">
                  <span className="label-icon">👤</span>
                  Your Name
                </label>
                <input
                  id="author"
                  type="text"
                  value={newCard.author}
                  onChange={(e) =>
                    setNewCard({ ...newCard, author: e.target.value })
                  }
                  placeholder="Enter your name"
                  required
                  className="modern-input"
                />
              </div>
              <div className="form-buttons">
                <button
                  type="submit"
                  className="submit-button modern-button primary"
                >
                  <span className="button-icon">🎉</span>
                  Add Kudos Card
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCardForm(false);
                    setNewCard({ message: "", author: "" });
                  }}
                  className="cancel-button modern-button secondary"
                >
                  <span className="button-icon">✕</span>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="cards-grid">
          {board.kudos.length === 0 ? (
            <div className="no-cards-message">
              <p>No kudos cards yet. Be the first to add one!</p>
            </div>
          ) : (
            board.kudos.map((card) => (
              <div key={card.id} className="kudos-card">
                <div className="card-content">
                  <p className="card-message">{card.message}</p>
                </div>
                <div className="card-actions">
                  <div className="card-upvote">
                    <button
                      onClick={() => handleUpvoteCard(card.id)}
                      className={`upvote-button modern-button ${
                        upvotingCards.has(card.id) ? "upvoting" : "upvote"
                      }`}
                      disabled={upvotingCards.has(card.id)}
                      title="Give kudos to this card"
                    >
                      <span className="upvote-icon">
                        {upvotingCards.has(card.id) ? "⏳" : "👍"}
                      </span>
                      <span className="upvote-count">{card.upvotes || 0}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="delete-card-button modern-button danger"
                    title="Delete this card"
                  >
                    <span className="button-icon">🗑️</span>
                  </button>
                </div>
                <div className="card-footer">
                  <div className="card-author">- {card.author}</div>
                  <div className="card-date">{formatDate(card.createdAt)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardDetails;
