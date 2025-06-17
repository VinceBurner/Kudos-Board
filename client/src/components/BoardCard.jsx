import React from "react";

const BoardCard = ({ board, onDelete }) => {
  const handleDelete = () => {
    onDelete(board.id);
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

  return (
    <div className="board-card">
      <div className="board-header">
        <h3 className="board-title">{board.title}</h3>
        <button
          className="delete-button"
          onClick={handleDelete}
          title="Delete board"
        >
          ×
        </button>
      </div>

      <div className="board-info">
        <div className="board-category">
          <span className="category-label">Category:</span>
          <span className="category-value">{board.category}</span>
        </div>

        <div className="board-author">
          <span className="author-label">Created by:</span>
          <span className="author-value">{board.author}</span>
        </div>

        <div className="board-date">
          <span className="date-label">Created:</span>
          <span className="date-value">{formatDate(board.createdAt)}</span>
        </div>

        <div className="board-kudos-count">
          <span className="kudos-label">Kudos:</span>
          <span className="kudos-value">
            {board.kudos ? board.kudos.length : 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
