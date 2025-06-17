import React, { useState, useEffect } from "react";
import BoardCard from "./BoardCard";

const BoardList = ({ refreshTrigger }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/boards");

      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }

      const boardsData = await response.json();
      setBoards(boardsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this board? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/boards/${boardId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete board");
      }

      // Remove the deleted board from the local state
      setBoards(boards.filter((board) => board.id !== boardId));
    } catch (err) {
      alert(`Error deleting board: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [refreshTrigger]);

  if (loading) {
    return <div className="loading">Loading boards...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="board-list">
      <h2>Kudos Boards ({boards.length})</h2>

      {boards.length === 0 ? (
        <div className="no-boards">
          <p>No boards created yet. Create your first board above!</p>
        </div>
      ) : (
        <div className="boards-grid">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onDelete={handleDeleteBoard}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;
