import React, { useState } from "react";

const BoardCard = ({
  board,
  onDelete,
  onCreateNew,
  onEdit,
  onViewDetails,
  isCreateCard = false,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    author: "",
    image: "",
  });
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
    author: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");

  const handleDelete = () => {
    onDelete(board.id);
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/boards", {
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

      // Reset form and close
      setFormData({
        title: "",
        description: "",
        category: "",
        author: "",
        image: "",
      });
      setShowCreateForm(false);

      // Notify parent component
      if (onCreateNew) {
        onCreateNew(newBoard);
      }
    } catch (err) {
      setError(err.message);
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
    setError("");
  };

  const handleEdit = () => {
    setEditFormData({
      title: board.title,
      description: board.description || "",
      category: board.category,
      author: board.author,
      image: board.image || "",
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
        `http://localhost:5000/api/boards/${board.id}`,
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

      // Close edit form
      setShowEditForm(false);
      setEditFormData({
        title: "",
        description: "",
        category: "",
        author: "",
        image: "",
      });

      // Notify parent component
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
    setEditFormData({
      title: "",
      description: "",
      category: "",
      author: "",
      image: "",
    });
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

  // Create new board card
  if (isCreateCard) {
    return (
      <div className="board-card create-card">
        {!showCreateForm ? (
          <div className="create-card-content">
            <div className="create-icon">+</div>
            <h3>Create New Board</h3>
            <p>Click to add a new kudos board</p>
            <button className="create-button" onClick={handleCreateNew}>
              Create Board
            </button>
          </div>
        ) : (
          <div className="create-form">
            <h3>New Kudos Board</h3>
            <form onSubmit={handleFormSubmit}>
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
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Board description (optional)"
                  rows="3"
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

              <div className="form-group">
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleFormChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  placeholder="Image URL (optional)"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-buttons">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelCreate}
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
  }

  // Regular board card
  return (
    <div className="board-card">
      {!showEditForm ? (
        <>
          <div className="board-header">
            <h3 className="board-title">{board.title}</h3>
            <div className="board-actions">
              <button
                className="create-button-small modern-button success"
                onClick={handleCreateNew}
                title="Create new board"
              >
                <span className="button-icon">✨</span>
              </button>
              <button
                className="edit-button modern-button secondary"
                onClick={handleEdit}
                title="Edit board"
              >
                <span className="button-icon">✏️</span>
              </button>
              <button
                className="delete-button modern-button danger"
                onClick={handleDelete}
                title="Delete board"
              >
                <span className="button-icon">🗑️</span>
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

            {board.description && (
              <div className="board-description">
                <span className="description-label">Description:</span>
                <p className="description-value">{board.description}</p>
              </div>
            )}
          </div>

          {board.image && (
            <div className="board-image">
              <img src={board.image} alt={board.title} />
            </div>
          )}

          <div className="board-footer">
            <button
              className="view-details-button modern-button primary"
              onClick={() => onViewDetails && onViewDetails(board.id)}
            >
              <span className="button-icon">👁️</span>
              View Details
            </button>
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
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
                placeholder="Board description (optional)"
                rows="3"
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
                <option value="celebration">Celebration</option>
                <option value="thank you">Thank You</option>
                <option value="inspiration">Inspiration</option>
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

            <div className="form-group">
              <input
                type="url"
                name="image"
                value={editFormData.image}
                onChange={handleEditFormChange}
                placeholder="Image URL (optional)"
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

export default BoardCard;
