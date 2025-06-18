import React, { useState } from "react";
import BoardForm from "./BoardForm";

const CreateBoardCard = ({ onCreateNew }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleFormSubmit = (newBoard) => {
    setShowCreateForm(false);
    if (onCreateNew) {
      onCreateNew(newBoard);
    }
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
  };

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
        <BoardForm
          title="New Kudos Board"
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          submitButtonText="Create"
          isSubmitting={false}
        />
      )}
    </div>
  );
};

export default CreateBoardCard;
