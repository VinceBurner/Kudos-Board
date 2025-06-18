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
