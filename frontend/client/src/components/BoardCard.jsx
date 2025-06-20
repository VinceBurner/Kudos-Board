import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BoardCard = ({ board, onDelete, onCreateNew, isCreateCard = false }) => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    author: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      const response = await fetch("process.env.API_URL || 'http://localhost:5000'/api/boards", {
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
                  placeholder="Board description (required)"
                  rows="3"
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

  // Simplified board card - image, title, view button, and delete button
  return (
    <div className="board-card simple-board-card">
      {board.image && (
        <div className="board-image">
          {board.image.startsWith("linear-gradient") ? (
            <div
              style={{ background: board.image }}
              className="board-image gradient-background"
            >
              <span>🎨 Gradient Background</span>
            </div>
          ) : (
            <img src={board.image} alt={board.title} />
          )}
        </div>
      )}

      <div className="board-header">
        <h3 className="board-title">{board.title}</h3>
      </div>

      <div className="board-actions-simple">
        <button
          className="view-details-button modern-button primary"
          onClick={() => navigate(`/boards/${board.id}`)}
        >
          <span className="button-icon">👁️</span>
          View Board
        </button>

        <button
          className="delete-button modern-button danger"
          onClick={handleDelete}
          title="Delete board"
        >
          <span className="button-icon">🗑️</span>
          Delete
        </button>
      </div>
    </div>
  );
};

export default BoardCard;
