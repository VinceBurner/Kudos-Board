const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// BOARD ROUTES

// GET all boards
app.get(
  "/api/boards",
  asyncHandler(async (_req, res) => {
    const boards = await prisma.board.findMany({
      include: {
        kudos: true,
        _count: {
          select: { kudos: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(boards);
  })
);

// GET a specific board by ID
app.get(
  "/api/boards/:id",
  asyncHandler(async (req, res) => {
    const boardId = parseInt(req.params.id);

    if (isNaN(boardId)) {
      return res.status(400).json({ error: "Invalid board ID" });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        kudos: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    res.json(board);
  })
);

// POST create a new board
app.post(
  "/api/boards",
  asyncHandler(async (req, res) => {
    const { title, description, category, author, image } = req.body;

    if (!title || !category || !author) {
      return res.status(400).json({
        error: "Title, category, and author are required",
      });
    }

    const newBoard = await prisma.board.create({
      data: {
        title,
        description: description || "",
        category,
        author,
        image: image || "",
      },
      include: {
        kudos: true,
      },
    });

    res.status(201).json(newBoard);
  })
);

// PUT update a board by ID
app.put(
  "/api/boards/:id",
  asyncHandler(async (req, res) => {
    const boardId = parseInt(req.params.id);
    const { title, description, category, author, image } = req.body;

    if (isNaN(boardId)) {
      return res.status(400).json({ error: "Invalid board ID" });
    }

    if (!title || !category || !author) {
      return res.status(400).json({
        error: "Title, category, and author are required",
      });
    }

    try {
      const updatedBoard = await prisma.board.update({
        where: { id: boardId },
        data: {
          title,
          description: description || "",
          category,
          author,
          image: image || "",
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
      throw error;
    }
  })
);

// DELETE a board by ID
app.delete(
  "/api/boards/:id",
  asyncHandler(async (req, res) => {
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

      res.json({
        message: "Board deleted successfully",
        board: deletedBoard,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Board not found" });
      }
      throw error;
    }
  })
);

// POST upvote a board
app.post(
  "/api/boards/:id/upvote",
  asyncHandler(async (req, res) => {
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
      throw error;
    }
  })
);

// KUDO/CARD ROUTES

// GET all kudos for a specific board
app.get(
  "/api/boards/:boardId/kudos",
  asyncHandler(async (req, res) => {
    const boardId = parseInt(req.params.boardId);

    if (isNaN(boardId)) {
      return res.status(400).json({ error: "Invalid board ID" });
    }

    const kudos = await prisma.kudo.findMany({
      where: { boardId },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(kudos);
  })
);

// POST create a new kudo/card
app.post(
  "/api/boards/:boardId/kudos",
  asyncHandler(async (req, res) => {
    const boardId = parseInt(req.params.boardId);
    const { message, author } = req.body;

    if (isNaN(boardId)) {
      return res.status(400).json({ error: "Invalid board ID" });
    }

    if (!message || !author) {
      return res.status(400).json({
        error: "Message and author are required",
      });
    }

    // Check if board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    const newKudo = await prisma.kudo.create({
      data: {
        message,
        author,
        boardId,
      },
    });

    res.status(201).json(newKudo);
  })
);

// PUT update a kudo/card
app.put(
  "/api/boards/:boardId/kudos/:kudoId",
  asyncHandler(async (req, res) => {
    const boardId = parseInt(req.params.boardId);
    const kudoId = parseInt(req.params.kudoId);
    const { message, author } = req.body;

    if (isNaN(boardId) || isNaN(kudoId)) {
      return res.status(400).json({ error: "Invalid board ID or kudo ID" });
    }

    if (!message || !author) {
      return res.status(400).json({
        error: "Message and author are required",
      });
    }

    try {
      const updatedKudo = await prisma.kudo.update({
        where: {
          id: kudoId,
          boardId: boardId,
        },
        data: {
          message,
          author,
        },
      });

      res.json(updatedKudo);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Kudo not found" });
      }
      throw error;
    }
  })
);

// DELETE a kudo/card
app.delete(
  "/api/boards/:boardId/kudos/:kudoId",
  asyncHandler(async (req, res) => {
    const boardId = parseInt(req.params.boardId);
    const kudoId = parseInt(req.params.kudoId);

    if (isNaN(boardId) || isNaN(kudoId)) {
      return res.status(400).json({ error: "Invalid board ID or kudo ID" });
    }

    try {
      const deletedKudo = await prisma.kudo.delete({
        where: {
          id: kudoId,
          boardId: boardId,
        },
      });

      res.json({
        message: "Kudo deleted successfully",
        kudo: deletedKudo,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Kudo not found" });
      }
      throw error;
    }
  })
);

// POST upvote a kudo/card
app.post(
  "/api/boards/:boardId/kudos/:kudoId/upvote",
  asyncHandler(async (req, res) => {
    const boardId = parseInt(req.params.boardId);
    const kudoId = parseInt(req.params.kudoId);

    if (isNaN(boardId) || isNaN(kudoId)) {
      return res.status(400).json({ error: "Invalid board ID or kudo ID" });
    }

    try {
      const updatedKudo = await prisma.kudo.update({
        where: {
          id: kudoId,
          boardId: boardId,
        },
        data: {
          upvotes: {
            increment: 1,
          },
        },
      });

      res.json({
        message: "Kudo upvoted successfully",
        kudo: updatedKudo,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Kudo not found" });
      }
      throw error;
    }
  })
);

// Global error handler
app.use((error, _req, res, _next) => {
  console.error("Error:", error);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;








const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

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

  if (!title || !category || !author) {
    return res
      .status(400)
      .json({ error: "Title, category, and author are required" });
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "Title must be a non-empty string" });
  }

  if (typeof category !== "string" || category.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Category must be a non-empty string" });
  }

  if (typeof author !== "string" || author.trim().length === 0) {
    return res.status(400).json({ error: "Author must be a non-empty string" });
  }

  if (description && typeof description !== "string") {
    return res.status(400).json({ error: "Description must be a string" });
  }

  if (image && typeof image !== "string") {
    return res.status(400).json({ error: "Image must be a string" });
  }

  try {
    const newBoard = await prisma.board.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : "",
        category: category.trim(),
        author: author.trim(),
        image: image ? image.trim() : "",
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

  if (!title || !category || !author) {
    return res
      .status(400)
      .json({ error: "Title, category, and author are required" });
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "Title must be a non-empty string" });
  }

  if (typeof category !== "string" || category.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Category must be a non-empty string" });
  }

  if (typeof author !== "string" || author.trim().length === 0) {
    return res.status(400).json({ error: "Author must be a non-empty string" });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ error: "Description must be a string" });
  }

  if (image !== undefined && typeof image !== "string") {
    return res.status(400).json({ error: "Image must be a string" });
  }

  try {
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        title: title.trim(),
        description: description !== undefined ? description.trim() : undefined,
        category: category.trim(),
        author: author.trim(),
        image: image !== undefined ? image.trim() : undefined,
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
        kudos: true,
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
  const { message, author } = req.body;

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
  const { message, author } = req.body;

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

  try {
    const updatedCard = await prisma.kudo.update({
      where: { id: cardId },
      data: {
        message: message.trim(),
        author: author.trim(),
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

