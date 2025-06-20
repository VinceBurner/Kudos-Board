// GIF-focused random image utility for boards and cards

// GIF Categories for different board types
const BOARD_GIF_CATEGORIES = {
  "Team Recognition": [
    "team celebration",
    "high five",
    "teamwork",
    "office party",
    "group hug",
    "collaboration",
    "team success",
    "office celebration",
  ],
  "Project Milestone": [
    "success",
    "achievement",
    "goal",
    "milestone",
    "project complete",
    "finish line",
    "victory dance",
    "mission accomplished",
  ],
  "Personal Achievement": [
    "winner",
    "trophy",
    "personal success",
    "achievement unlocked",
    "level up",
    "you did it",
    "proud moment",
    "celebration dance",
  ],
  Innovation: [
    "innovation",
    "creative",
    "idea",
    "lightbulb moment",
    "breakthrough",
    "genius",
    "eureka",
    "mind blown",
  ],
  Collaboration: [
    "teamwork",
    "partnership",
    "together",
    "unity",
    "helping hands",
    "support",
    "cooperation",
    "working together",
  ],
  celebration: [
    "party",
    "celebration",
    "confetti",
    "balloons",
    "happy",
    "joy",
    "festive",
    "party time",
  ],
  "thank you": [
    "thank you",
    "grateful",
    "appreciation",
    "thanks",
    "gratitude",
    "heart",
    "love",
    "thankful",
  ],
  inspiration: [
    "inspiration",
    "motivation",
    "positive",
    "energy",
    "uplifting",
    "encouraging",
    "believe",
    "you can do it",
  ],
  Other: [
    "positive vibes",
    "good job",
    "well done",
    "awesome",
    "amazing",
    "fantastic",
    "excellent",
    "outstanding",
  ],
};

// Card-specific GIF terms for kudos
const CARD_GIF_CATEGORIES = {
  celebration: [
    "thumbs up",
    "clapping",
    "high five",
    "celebration",
    "party",
    "applause",
    "cheering",
    "confetti",
    "balloons",
    "happy dance",
  ],
  appreciation: [
    "thank you",
    "grateful",
    "heart",
    "love",
    "appreciation",
    "hug",
    "warm fuzzy",
    "gratitude",
  ],
  success: [
    "success",
    "victory",
    "winner",
    "achievement",
    "goal",
    "you did it",
    "nailed it",
    "crushing it",
  ],
  motivation: [
    "you got this",
    "keep going",
    "motivation",
    "inspiration",
    "believe",
    "strong",
    "power",
    "unstoppable",
  ],
  fun: [
    "awesome",
    "amazing",
    "fantastic",
    "cool",
    "epic",
    "legendary",
    "incredible",
    "mind blown",
  ],
};

// Fallback images in case APIs fail
const FALLBACK_BOARD_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
];

const FALLBACK_CARD_IMAGES = [
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
];

const FALLBACK_GIFS = [
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
  "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif",
];

// API Functions

/**
 * Fetch random image from Unsplash API
 * @param {string} query - Search query
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<string>} Image URL
 */
const fetchUnsplashImage = async (query, width = 800, height = 600) => {
  try {
    // Using Unsplash Source API (no API key required)
    const searchTerm = encodeURIComponent(query);
    const url = `https://source.unsplash.com/${width}x${height}/?${searchTerm}`;
    return url;
  } catch (error) {
    console.warn("Unsplash API failed, using fallback:", error);
    return null;
  }
};

/**
 * Fetch random GIF from Giphy API
 * @param {string} query - Search query
 * @returns {Promise<string>} GIF URL
 */
const fetchGiphyGif = async (query) => {
  try {
    // Using Giphy's public API endpoint (no key required for basic usage)
    const searchTerm = encodeURIComponent(query);
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=demo&q=${searchTerm}&limit=20&rating=g`
    );

    if (!response.ok) {
      throw new Error("Giphy API request failed");
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.data.length);
      return data.data[randomIndex].images.fixed_height.url;
    }

    throw new Error("No GIFs found");
  } catch (error) {
    console.warn("Giphy API failed, using fallback:", error);
    return null;
  }
};

/**
 * Get a random board GIF based on category
 * @param {string} category - The board category
 * @returns {Promise<string>} Random GIF URL
 */
export const getRandomBoardImage = async (category = "Other") => {
  try {
    const searchTerms =
      BOARD_GIF_CATEGORIES[category] || BOARD_GIF_CATEGORIES["Other"];
    const randomTerm =
      searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const gifUrl = await fetchGiphyGif(randomTerm);

    if (gifUrl) {
      return gifUrl;
    }
  } catch (error) {
    console.warn("Failed to fetch board GIF from API:", error);
  }

  // Fallback to static GIFs
  const randomIndex = Math.floor(Math.random() * FALLBACK_GIFS.length);
  return FALLBACK_GIFS[randomIndex];
};

/**
 * Get a random GIF for a kudos card
 * @param {string} cardType - Type of card GIF ('celebration', 'appreciation', 'success', 'motivation', 'fun')
 * @returns {Promise<string>} Random GIF URL
 */
export const getRandomCardImage = async (cardType = "celebration") => {
  try {
    const searchTerms =
      CARD_GIF_CATEGORIES[cardType] || CARD_GIF_CATEGORIES["celebration"];
    const randomTerm =
      searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const gifUrl = await fetchGiphyGif(randomTerm);

    if (gifUrl) {
      return gifUrl;
    }
  } catch (error) {
    console.warn("Failed to fetch card GIF from API:", error);
  }

  // Fallback to static GIFs
  const randomIndex = Math.floor(Math.random() * FALLBACK_GIFS.length);
  return FALLBACK_GIFS[randomIndex];
};

/**
 * Get a random image from Picsum (Lorem Picsum) service
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} seed - Optional seed for consistent random image
 * @returns {string} Picsum image URL
 */
export const getPicsumImage = (width = 800, height = 600, seed = null) => {
  const baseUrl = "https://picsum.photos";
  const seedParam = seed
    ? `?random=${seed}`
    : `?random=${Math.floor(Math.random() * 1000)}`;
  return `${baseUrl}/${width}/${height}${seedParam}`;
};

/**
 * Get a random gradient background
 * @returns {string} CSS gradient string
 */
export const getRandomGradient = () => {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
  ];

  const randomIndex = Math.floor(Math.random() * gradients.length);
  return gradients[randomIndex];
};

/**
 * Get all available board categories
 * @returns {Array} Array of category names
 */
export const getBoardCategories = () => {
  return Object.keys(BOARD_GIF_CATEGORIES);
};

/**
 * Generate a random image based on type and preferences
 * @param {string} type - 'board' or 'card'
 * @param {Object} options - Options object
 * @param {string} options.category - Board category (for boards)
 * @param {boolean} options.useGif - Use GIF instead of static image (for cards)
 * @param {boolean} options.usePicsum - Use Picsum service
 * @param {boolean} options.useGradient - Use gradient background
 * @returns {string} Random image URL or gradient
 */
export const getRandomImage = (type = "board", options = {}) => {
  const { category, useGif, usePicsum, useGradient } = options;

  if (useGradient) {
    return getRandomGradient();
  }

  if (usePicsum) {
    return type === "board"
      ? getPicsumImage(800, 600)
      : getPicsumImage(400, 300);
  }

  if (type === "card") {
    return getRandomCardImage(useGif);
  }

  return getRandomBoardImage(category);
};
