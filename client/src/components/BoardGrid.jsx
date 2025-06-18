import React from "react";
import BoardCard from "./BoardCard";

const BoardGrid = ({
  showCreateCard,
  onCreateNew,
  displayBoards,
  onDeleteBoard,
  onEditBoard,
}) => {
  return (
    <div className="boards-grid">
      {/* Create new board card - show based on filter */}
      {showCreateCard && (
        <BoardCard isCreateCard={true} onCreateNew={onCreateNew} />
      )}

      {/* Existing boards */}
      {displayBoards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          onDelete={onDeleteBoard}
          onCreateNew={onCreateNew}
          onEdit={onEditBoard}
        />
      ))}
    </div>
  );
};

export default BoardGrid;
