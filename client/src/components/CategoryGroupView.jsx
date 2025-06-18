import React from "react";
import BoardCard from "./BoardCard";

const CategoryGroupView = ({
  showCreateCard,
  onCreateNew,
  groupedBoards,
  onDeleteBoard,
  onEditBoard,
}) => {
  return (
    <div className="category-grouped-view">
      {/* Create new board card - show at top */}
      {showCreateCard && (
        <div className="create-card-section">
          <BoardCard isCreateCard={true} onCreateNew={onCreateNew} />
        </div>
      )}

      {/* Category Groups */}
      {Object.entries(groupedBoards).map(([category, categoryBoards]) => (
        <div key={category} className="category-group">
          <div className="category-header">
            <h3 className="category-title">{category}</h3>
            <span className="category-count">
              ({categoryBoards.length} boards)
            </span>
          </div>
          <div className="boards-grid">
            {categoryBoards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onDelete={onDeleteBoard}
                onCreateNew={onCreateNew}
                onEdit={onEditBoard}
              />
            ))}
          </div>
        </div>
      ))}

      {Object.keys(groupedBoards).length === 0 && (
        <div className="no-categories-message">
          <p>No boards to group by category yet.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryGroupView;
