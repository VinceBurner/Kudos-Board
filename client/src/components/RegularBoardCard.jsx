import React, { useState } from "react";
import BoardForm from "./BoardForm";

const RegularBoardCard = ({ board, onDelete, onCreateNew, onEdit }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleDelete = () => {
    onDelete(board.id);
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleEditSubmit = (updatedBoard) => {
    setShowEditForm(false);
    if (onEdit) {
      onEdit(updatedBoard);
    }
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
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
      {!showEditForm ? (
        <>
          <div className="board-header">
            <h3 className="board-title">{board.title}</h3>
            <div className="board-actions">
              <button
                className="create-button-small"
                onClick={handleCreateNew}
                title="Create new board"
              >
                +
              </button>
              <button
                className="edit-button"
                onClick={handleEdit}
                title="Edit board"
              >
                ✎
              </button>
              <button
                className="delete-button"
                onClick={handleDelete}
                title="Delete board"
              >
                ×
              </button>
            </div>
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

            {board.updatedAt && (
              <div className="board-updated">
                <span className="updated-label">Updated:</span>
                <span className="updated-value">
                  {formatDate(board.updatedAt)}
                </span>
              </div>
            )}

            <div className="board-kudos-count">
              <span className="kudos-label">Kudos:</span>
              <span className="kudos-value">
                {board.kudos ? board.kudos.length : 0}
              </span>
            </div>
          </div>
        </>
      ) : (
        <BoardForm
          title="Edit Board"
          initialData={{
            title: board.title,
            category: board.category,
            author: board.author,
          }}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
          submitButtonText="Update"
          apiEndpoint={`http://localhost:5000/api/boards/${board.id}`}
          method="PUT"
        />
      )}
    </div>
  );
};

export default RegularBoardCard;
