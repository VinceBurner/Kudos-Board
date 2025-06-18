const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit();
});

// GET all boards
app.get("/api/boards", async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        cards: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the frontend expectations
    const transformedBoards = boards.map((board) => ({
      ...board,
      kudos: board.cards, // Frontend expects 'kudos' instead of 'cards'
    }));

    res.json(transformedBoards);
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

  try {
    const newBoard = await prisma.board.create({
      data: {
        title,
        description: description || "",
        category,
        author,
        image: image || "",
      },
      include: {
        cards: true,
      },
    });

    // Transform the data to match the frontend expectations
    const transformedBoard = {
      ...newBoard,
      kudos: newBoard.cards, // Frontend expects 'kudos' instead of 'cards'
    };

    res.status(201).json(transformedBoard);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: "Failed to create board" });
  }
});

// PUT update a board by ID
app.put("/api/boards/:id", async (req, res) => {
  const boardId = parseInt(req.params.id);
  const { title, description, category, author, image, kudos } = req.body;

  if (!title || !category || !author) {
    return res
      .status(400)
      .json({ error: "Title, category, and author are required" });
  }

  try {
    // Check if board exists
    const existingBoard = await prisma.board.findUnique({
      where: { id: boardId },
      include: { cards: true },
    });

    if (!existingBoard) {
      return res.status(404).json({ error: "Board not found" });
    }

    // If kudos array is provided, handle card updates
    if (kudos && Array.isArray(kudos)) {
      // Delete all existing cards for this board
      await prisma.card.deleteMany({
        where: { boardId: boardId },
      });

      // Create new cards
      if (kudos.length > 0) {
        await prisma.card.createMany({
          data: kudos.map((card) => ({
            message: card.message,
            author: card.author,
            upvotes: card.upvotes || 0,
            boardId: boardId,
            createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
          })),
        });
      }
    }

    // Update the board
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        title,
        description:
          description !== undefined ? description : existingBoard.description,
        category,
        author,
        image: image !== undefined ? image : existingBoard.image,
      },
      include: {
        cards: true,
      },
    });

    // Transform the data to match the frontend expectations
    const transformedBoard = {
      ...updatedBoard,
      kudos: updatedBoard.cards, // Frontend expects 'kudos' instead of 'cards'
    };

    res.json(transformedBoard);
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ error: "Failed to update board" });
  }
});

// DELETE a board by ID
app.delete("/api/boards/:id", async (req, res) => {
  const boardId = parseInt(req.params.id);

  try {
    // Check if board exists
    const existingBoard = await prisma.board.findUnique({
      where: { id: boardId },
      include: { cards: true },
    });

    if (!existingBoard) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Delete the board (cards will be deleted automatically due to cascade)
    const deletedBoard = await prisma.board.delete({
      where: { id: boardId },
      include: { cards: true },
    });

    // Transform the data to match the frontend expectations
    const transformedBoard = {
      ...deletedBoard,
      kudos: deletedBoard.cards, // Frontend expects 'kudos' instead of 'cards'
    };

    res.json({
      message: "Board deleted successfully",
      board: transformedBoard,
    });
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ error: "Failed to delete board" });
  }
});

// GET a specific board by ID
app.get("/api/boards/:id", async (req, res) => {
  const boardId = parseInt(req.params.id);

  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        cards: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Transform the data to match the frontend expectations
    const transformedBoard = {
      ...board,
      kudos: board.cards, // Frontend expects 'kudos' instead of 'cards'
    };

    res.json(transformedBoard);
  } catch (error) {
    console.error("Error fetching board:", error);
    res.status(500).json({ error: "Failed to fetch board" });
  }
});

// POST upvote a card in a board
app.post("/api/boards/:boardId/cards/:cardId/upvote", async (req, res) => {
  const boardId = parseInt(req.params.boardId);
  const cardId = parseInt(req.params.cardId);

  try {
    // Check if board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { cards: true },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Check if card exists
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        boardId: boardId,
      },
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Increment upvotes
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });

    // Update board's updatedAt timestamp
    await prisma.board.update({
      where: { id: boardId },
      data: {
        updatedAt: new Date(),
      },
    });

    // Get the updated board with all cards
    const updatedBoard = await prisma.board.findUnique({
      where: { id: boardId },
      include: { cards: true },
    });

    // Transform the data to match the frontend expectations
    const transformedBoard = {
      ...updatedBoard,
      kudos: updatedBoard.cards, // Frontend expects 'kudos' instead of 'cards'
    };

    res.json({
      message: "Card upvoted successfully",
      card: updatedCard,
      board: transformedBoard,
    });
  } catch (error) {
    console.error("Error upvoting card:", error);
    res.status(500).json({ error: "Failed to upvote card" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
