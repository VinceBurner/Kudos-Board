import React from "react";
import CreateBoardCard from "./CreateBoardCard";
import RegularBoardCard from "./RegularBoardCard";

const BoardCard = ({
  board,
  onDelete,
  onCreateNew,
  onEdit,
  isCreateCard = false,
}) => {
  if (isCreateCard) {
    return <CreateBoardCard onCreateNew={onCreateNew} />;
  }

  return (
    <RegularBoardCard
      board={board}
      onDelete={onDelete}
      onCreateNew={onCreateNew}
      onEdit={onEdit}
    />
  );
};

export default BoardCard;
