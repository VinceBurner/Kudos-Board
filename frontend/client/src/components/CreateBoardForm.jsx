import React, { useState } from "react";
import { getRandomBoardImage, getRandomGradient } from "../utils/randomImages";

const CreateBoardForm = ({ onCreateNew, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    author: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

      setFormData({
        title: "",
        description: "",
        category: "",
        author: "",
        image: "",
      });

      if (onCreateNew) {
        onCreateNew(newBoard);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      author: "",
      image: "",
    });
    setError("");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="create-board-form">
      <div className="create-form-container">
        <h3>Create New Kudos Board</h3>
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
              <option value="Team Recognition">Team Recognition</option>
              <option value="Project Milestone">Project Milestone</option>
              <option value="Personal Achievement">Personal Achievement</option>
              <option value="Innovation">Innovation</option>
              <option value="Collaboration">Collaboration</option>
              <option value="Other">Other</option>
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
            <div className="random-image-buttons">
              <button
                type="button"
                onClick={async () => {
                  const gifUrl = await getRandomBoardImage(formData.category);
                  setFormData({
                    ...formData,
                    image: gifUrl,
                  });
                }}
                className="random-button"
                title="Get random GIF based on category"
              >
                🎉 Random GIF
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, image: getRandomGradient() })
                }
                className="random-button"
                title="Get random gradient background"
              >
                🌈 Random Gradient
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-buttons">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Creating..." : "Create Board"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardForm;
