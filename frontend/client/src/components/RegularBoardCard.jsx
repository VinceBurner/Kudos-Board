import React, { useState } from "react";

const RegularBoardCard = ({ board, onDelete, onEdit }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    author: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState("");

  const handleDelete = () => {
    onDelete(board.id);
  };

  const handleEdit = () => {
    setEditFormData({
      title: board.title,
      category: board.category,
      author: board.author,
    });
    setShowEditForm(true);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    setEditError("");

    try {
      const response = await fetch(
        `${import.meta.env.process.env.API_URL}/api/boards/${board.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update board");
      }

      const updatedBoard = await response.json();

      setShowEditForm(false);
      setEditFormData({ title: "", category: "", author: "" });

      if (onEdit) {
        onEdit(updatedBoard);
      }
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditFormData({ title: "", category: "", author: "" });
    setEditError("");
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
        <div className="edit-form">
          <h3>Edit Board</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditFormChange}
                placeholder="Board title"
                required
              />
            </div>

            <div className="form-group">
              <select
                name="category"
                value={editFormData.category}
                onChange={handleEditFormChange}
                required
              >
                <option value="">Select category</option>
                <option value="Team Recognition">Team Recognition</option>
                <option value="Project Milestone">Project Milestone</option>
                <option value="Personal Achievement">
                  Personal Achievement
                </option>
                <option value="Innovation">Innovation</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="author"
                value={editFormData.author}
                onChange={handleEditFormChange}
                placeholder="Author name"
                required
              />
            </div>

            {editError && <div className="error-message">{editError}</div>}

            <div className="form-buttons">
              <button
                type="submit"
                disabled={isEditing}
                className="submit-button"
              >
                {isEditing ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegularBoardCard;
