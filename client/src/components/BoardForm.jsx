import React, { useState, useEffect } from "react";

const BoardForm = ({
  title,
  initialData = { title: "", category: "", author: "" },
  onSubmit,
  onCancel,
  submitButtonText = "Submit",
  apiEndpoint = "http://localhost:5000/api/boards",
  method = "POST",
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(apiEndpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${method === "POST" ? "create" : "update"} board`
        );
      }

      const resultBoard = await response.json();

      // Reset form
      setFormData({ title: "", category: "", author: "" });

      // Notify parent component
      if (onSubmit) {
        onSubmit(resultBoard);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", category: "", author: "" });
    setError("");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="create-form">
      <h3>{title}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Board title"
            required
          />
        </div>

        <div className="form-group">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
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
            onChange={handleChange}
            placeholder="Your name"
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
            {isSubmitting ? `${submitButtonText}ing...` : submitButtonText}
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
  );
};

export default BoardForm;
