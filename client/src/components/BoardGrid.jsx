import React from "react";
import RegularBoardCard from "./RegularBoardCard";

const BoardGrid = ({ boards, onDeleteBoard, onEditBoard }) => {
  return (
    <div className="boards-grid">
      {boards.map((board) => (
        <RegularBoardCard
          key={board.id}
          board={board}
          onDelete={onDeleteBoard}
          onEdit={onEditBoard}
        />
      ))}
    </div>
  );
};

export default BoardGrid;
