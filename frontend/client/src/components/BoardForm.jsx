import React, { useState } from "react";
import GifSearchModal from "./GifSearchModal";

const BoardForm = ({ onBoardCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isGifSearchOpen, setIsGifSearchOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGifSelect = (gifUrl) => {
    setFormData({
      ...formData,
      image: gifUrl,
    });
  };

  const handleSubmit = async (e) => {
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

      // Reset form
      setFormData({
        title: "",
        category: "",
        author: "",
        image: "",
      });

      // Notify parent component
      if (onBoardCreated) {
        onBoardCreated(newBoard);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="board-form">
      <h2>Create New Kudos Board</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Board Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter board title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Team Recognition">Team Recognition</option>
            <option value="Project Milestone">Project Milestone</option>
            <option value="Personal Achievement">Personal Achievement</option>
            <option value="Innovation">Innovation</option>
            <option value="Collaboration">Collaboration</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="author">Your Name:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Board Image (Optional):</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter image URL or use search below"
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

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Board"}
        </button>
      </form>

      <GifSearchModal
        isOpen={isGifSearchOpen}
        onClose={() => setIsGifSearchOpen(false)}
        onSelectGif={handleGifSelect}
      />
    </div>
  );
};

export default BoardForm;
