const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for boards (in production, you'd use a database)
let boards = [];
let nextId = 1;

// GET all boards
app.get("/api/boards", (req, res) => {
  res.json(boards);
});

// POST create a new board
app.post("/api/boards", (req, res) => {
  const { title, description, category, author, image } = req.body;

  if (!title || !category || !author) {
    return res
      .status(400)
      .json({ error: "Title, category, and author are required" });
  }

  const newBoard = {
    id: nextId++,
    title,
    description: description || "",
    category,
    author,
    image: image || "",
    createdAt: new Date().toISOString(),
    kudos: [],
  };

  boards.push(newBoard);
  res.status(201).json(newBoard);
});

// PUT update a board by ID
app.put("/api/boards/:id", (req, res) => {
  const boardId = parseInt(req.params.id);
  const { title, description, category, author, image } = req.body;
  const boardIndex = boards.findIndex((board) => board.id === boardId);

  if (boardIndex === -1) {
    return res.status(404).json({ error: "Board not found" });
  }

  if (!title || !category || !author) {
    return res
      .status(400)
      .json({ error: "Title, category, and author are required" });
  }

  // Update the board
  boards[boardIndex] = {
    ...boards[boardIndex],
    title,
    description:
      description !== undefined ? description : boards[boardIndex].description,
    category,
    author,
    image: image !== undefined ? image : boards[boardIndex].image,
    updatedAt: new Date().toISOString(),
  };

  res.json(boards[boardIndex]);
});

// DELETE a board by ID
app.delete("/api/boards/:id", (req, res) => {
  const boardId = parseInt(req.params.id);
  const boardIndex = boards.findIndex((board) => board.id === boardId);

  if (boardIndex === -1) {
    return res.status(404).json({ error: "Board not found" });
  }

  const deletedBoard = boards.splice(boardIndex, 1)[0];
  res.json({ message: "Board deleted successfully", board: deletedBoard });
});

// GET a specific board by ID
app.get("/api/boards/:id", (req, res) => {
  const boardId = parseInt(req.params.id);
  const board = boards.find((board) => board.id === boardId);

  if (!board) {
    return res.status(404).json({ error: "Board not found" });
  }

  res.json(board);
});

// POST upvote a card in a board
app.post("/api/boards/:boardId/cards/:cardId/upvote", (req, res) => {
  const boardId = parseInt(req.params.boardId);
  const cardId = parseInt(req.params.cardId);

  const boardIndex = boards.findIndex((board) => board.id === boardId);

  if (boardIndex === -1) {
    return res.status(404).json({ error: "Board not found" });
  }

  const cardIndex = boards[boardIndex].kudos.findIndex(
    (card) => card.id === cardId
  );

  if (cardIndex === -1) {
    return res.status(404).json({ error: "Card not found" });
  }

  // Initialize upvotes if it doesn't exist
  if (!boards[boardIndex].kudos[cardIndex].upvotes) {
    boards[boardIndex].kudos[cardIndex].upvotes = 0;
  }

  // Increment upvotes
  boards[boardIndex].kudos[cardIndex].upvotes += 1;
  boards[boardIndex].updatedAt = new Date().toISOString();

  res.json({
    message: "Card upvoted successfully",
    card: boards[boardIndex].kudos[cardIndex],
    board: boards[boardIndex],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
