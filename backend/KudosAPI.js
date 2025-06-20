const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma");

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// GET all boards
app.get("/api/boards", async (_req, res) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        kudos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

// POST create a new board
app.post("/api/boards", async (req, res) => {
  const { title, description, category, author, image } = req.body;

  if (!title || !category || !description || !image) {
    return res
      .status(400)
      .json({ error: "Title, category, description, and image are required" });
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "Title must be a non-empty string" });
  }

  if (typeof category !== "string" || category.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Category must be a non-empty string" });
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Description must be a non-empty string" });
  }

  if (typeof image !== "string" || image.trim().length === 0) {
    return res.status(400).json({ error: "Image must be a non-empty string" });
  }

  if (author && typeof author !== "string") {
    return res.status(400).json({ error: "Author must be a string" });
  }

  try {
    const newBoard = await prisma.board.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        author: author ? author.trim() : "",
        image: image.trim(),
        upvotes: 0,
      },
      include: {
        kudos: true,
      },
    });

    res.status(201).json(newBoard);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: "Failed to create board" });
  }
});

// PUT update a board by ID
app.put("/api/boards/:id", async (req, res) => {
  const boardId = parseInt(req.params.id);
  const { title, description, category, author, image } = req.body;

  if (isNaN(boardId)) {
    return res.status(400).json({ error: "Invalid board ID" });
  }

  if (!title || !category || !description || !image) {
    return res
      .status(400)
      .json({ error: "Title, category, description, and image are required" });
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "Title must be a non-empty string" });
  }

  if (typeof category !== "string" || category.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Category must be a non-empty string" });
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Description must be a non-empty string" });
  }

  if (typeof image !== "string" || image.trim().length === 0) {
    return res.status(400).json({ error: "Image must be a non-empty string" });
  }

  if (author && typeof author !== "string") {
    return res.status(400).json({ error: "Author must be a string" });
  }

  try {
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        author: author ? author.trim() : "",
        image: image.trim(),
      },
      include: {
        kudos: true,
      },
    });

    res.json(updatedBoard);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Board not found" });
    }
    console.error("Error updating board:", error);
    res.status(500).json({ error: "Failed to update board" });
  }
});

// DELETE a board by ID
app.delete("/api/boards/:id", async (req, res) => {
  const boardId = parseInt(req.params.id);

  if (isNaN(boardId)) {
    return res.status(400).json({ error: "Invalid board ID" });
  }

  try {
    const deletedBoard = await prisma.board.delete({
      where: { id: boardId },
      include: {
        kudos: true,
      },
    });

    res.json({ message: "Board deleted successfully", board: deletedBoard });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Board not found" });
    }
    console.error("Error deleting board:", error);
    res.status(500).json({ error: "Failed to delete board" });
  }
});

// GET a specific board by ID
app.get("/api/boards/:id", async (req, res) => {
  const boardId = parseInt(req.params.id);

  if (isNaN(boardId)) {
    return res.status(400).json({ error: "Invalid board ID" });
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        kudos: {
          orderBy: [
            { pinned: "desc" }, // Pinned cards first
            { pinnedAt: "desc" }, // Then by most recently pinned first
            { createdAt: "desc" }, // Then by newest first for unpinned cards
          ],
        },
      },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    res.json(board);
  } catch (error) {
    console.error("Error fetching board:", error);
    res.status(500).json({ error: "Failed to fetch board" });
  }
});

// POST upvote a board
app.post("/api/boards/:id/upvote", async (req, res) => {
  const boardId = parseInt(req.params.id);

  if (isNaN(boardId)) {
    return res.status(400).json({ error: "Invalid board ID" });
  }

  try {
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        upvotes: {
          increment: 1,
        },
      },
      include: {
        kudos: true,
      },
    });

    res.json({
      message: "Board upvoted successfully",
      board: updatedBoard,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Board not found" });
    }
    console.error("Error upvoting board:", error);
    res.status(500).json({ error: "Failed to upvote board" });
  }
});

// ===== CARD/KUDO CRUD OPERATIONS =====

// GET all cards for a specific board
app.get("/api/boards/:boardId/cards", async (req, res) => {
  const boardId = parseInt(req.params.boardId);

  if (isNaN(boardId)) {
    return res.status(400).json({ error: "Invalid board ID" });
  }

  try {
    // First check if the board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Get all cards for the board
    const cards = await prisma.kudo.findMany({
      where: { boardId: boardId },
      orderBy: { createdAt: "desc" },
    });

    res.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

// GET a specific card by ID
app.get("/api/cards/:id", async (req, res) => {
  const cardId = parseInt(req.params.id);

  if (isNaN(cardId)) {
    return res.status(400).json({ error: "Invalid card ID" });
  }

  try {
    const card = await prisma.kudo.findUnique({
      where: { id: cardId },
      include: {
        board: true,
      },
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({ error: "Failed to fetch card" });
  }
});

// POST create a new card for a board
app.post("/api/boards/:boardId/cards", async (req, res) => {
  const boardId = parseInt(req.params.boardId);
  const { message, author, image } = req.body;

  if (isNaN(boardId)) {
    return res.status(400).json({ error: "Invalid board ID" });
  }

  if (!message || !author) {
    return res.status(400).json({ error: "Message and author are required" });
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Message must be a non-empty string" });
  }

  if (typeof author !== "string" || author.trim().length === 0) {
    return res.status(400).json({ error: "Author must be a non-empty string" });
  }

  if (image && typeof image !== "string") {
    return res.status(400).json({ error: "Image must be a string" });
  }

  try {
    // First check if the board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Create the new card
    const newCard = await prisma.kudo.create({
      data: {
        message: message.trim(),
        author: author.trim(),
        image: image ? image.trim() : null,
        boardId: boardId,
        upvotes: 0,
      },
      include: {
        board: true,
      },
    });

    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ error: "Failed to create card" });
  }
});

// PUT update a card by ID
app.put("/api/cards/:id", async (req, res) => {
  const cardId = parseInt(req.params.id);
  const { message, author, image } = req.body;

  if (isNaN(cardId)) {
    return res.status(400).json({ error: "Invalid card ID" });
  }

  if (!message || !author) {
    return res.status(400).json({ error: "Message and author are required" });
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Message must be a non-empty string" });
  }

  if (typeof author !== "string" || author.trim().length === 0) {
    return res.status(400).json({ error: "Author must be a non-empty string" });
  }

  if (image !== undefined && typeof image !== "string") {
    return res.status(400).json({ error: "Image must be a string" });
  }

  try {
    const updatedCard = await prisma.kudo.update({
      where: { id: cardId },
      data: {
        message: message.trim(),
        author: author.trim(),
        image: image !== undefined ? (image ? image.trim() : null) : undefined,
      },
      include: {
        board: true,
      },
    });

    res.json(updatedCard);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Card not found" });
    }
    console.error("Error updating card:", error);
    res.status(500).json({ error: "Failed to update card" });
  }
});

// DELETE a card by ID
app.delete("/api/cards/:id", async (req, res) => {
  const cardId = parseInt(req.params.id);

  if (isNaN(cardId)) {
    return res.status(400).json({ error: "Invalid card ID" });
  }

  try {
    const deletedCard = await prisma.kudo.delete({
      where: { id: cardId },
      include: {
        board: true,
      },
    });

    res.json({ message: "Card deleted successfully", card: deletedCard });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Card not found" });
    }
    console.error("Error deleting card:", error);
    res.status(500).json({ error: "Failed to delete card" });
  }
});

// POST upvote a card
app.post("/api/cards/:id/upvote", async (req, res) => {
  const cardId = parseInt(req.params.id);

  if (isNaN(cardId)) {
    return res.status(400).json({ error: "Invalid card ID" });
  }

  try {
    const updatedCard = await prisma.kudo.update({
      where: { id: cardId },
      data: {
        upvotes: {
          increment: 1,
        },
      },
      include: {
        board: true,
      },
    });

    res.json({
      message: "Card upvoted successfully",
      card: updatedCard,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Card not found" });
    }
    console.error("Error upvoting card:", error);
    res.status(500).json({ error: "Failed to upvote card" });
  }
});

// POST upvote a card in a board (alternative route for backward compatibility)
app.post("/api/boards/:boardId/cards/:cardId/upvote", async (req, res) => {
  const boardId = parseInt(req.params.boardId);
  const cardId = parseInt(req.params.cardId);

  if (isNaN(boardId) || isNaN(cardId)) {
    return res.status(400).json({ error: "Invalid board ID or card ID" });
  }

  try {
    // First check if the board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { kudos: true },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Update the kudo (card) upvotes
    const updatedCard = await prisma.kudo.update({
      where: {
        id: cardId,
        boardId: boardId, // Ensure the card belongs to the specified board
      },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });

    // Get the updated board with all kudos
    const updatedBoard = await prisma.board.findUnique({
      where: { id: boardId },
      include: { kudos: true },
    });

    res.json({
      message: "Card upvoted successfully",
      card: updatedCard,
      board: updatedBoard,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Card not found or doesn't belong to this board" });
    }
    console.error("Error upvoting card:", error);
    res.status(500).json({ error: "Failed to upvote card" });
  }
});

// POST pin a card
app.post("/api/cards/:cardId/pin", async (req, res) => {
  const cardId = parseInt(req.params.cardId);

  if (isNaN(cardId)) {
    return res.status(400).json({ error: "Invalid card ID" });
  }

  try {
    const updatedCard = await prisma.kudo.update({
      where: { id: cardId },
      data: {
        pinned: true,
        pinnedAt: new Date(),
      },
      include: {
        board: true,
      },
    });

    res.json({
      success: true,
      message: "Card pinned successfully",
      card: updatedCard,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Card not found" });
    }
    console.error("Error pinning card:", error);
    res.status(500).json({ error: "Failed to pin card" });
  }
});

// POST unpin a card
app.post("/api/cards/:cardId/unpin", async (req, res) => {
  const cardId = parseInt(req.params.cardId);

  if (isNaN(cardId)) {
    return res.status(400).json({ error: "Invalid card ID" });
  }

  try {
    const updatedCard = await prisma.kudo.update({
      where: { id: cardId },
      data: {
        pinned: false,
        pinnedAt: null,
      },
      include: {
        board: true,
      },
    });

    res.json({
      success: true,
      message: "Card unpinned successfully",
      card: updatedCard,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Card not found" });
    }
    console.error("Error unpinning card:", error);
    res.status(500).json({ error: "Failed to unpin card" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
