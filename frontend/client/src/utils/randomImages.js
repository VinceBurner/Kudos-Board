// Random image utility functions for boards and cards

// Predefined categories of images for different board types
const IMAGE_CATEGORIES = {
  "Team Recognition": [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
  ],
  "Project Milestone": [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  ],
  "Personal Achievement": [
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
  ],
  Innovation: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
  ],
  Collaboration: [
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop",
  ],
  Other: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
  ],
};

// Fun GIFs for kudos cards
const KUDOS_GIFS = [
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", // Thumbs up
  "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif", // Clapping
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // High five
  "https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif", // Celebration
  "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif", // Party
  "https://media.giphy.com/media/3o7abAHdYvZdBNnGZq/giphy.gif", // Applause
  "https://media.giphy.com/media/26u4b45b8KlFpqSuQ/giphy.gif", // Cheering
  "https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif", // Success
  "https://media.giphy.com/media/26u4cS6zAgvkQXyj6/giphy.gif", // Victory
  "https://media.giphy.com/media/3o7absbD7PbTFQa0c8/giphy.gif", // Awesome
];

// Motivational/positive images for cards
const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
];

/**
 * Get a random board background image based on category
 * @param {string} category - The board category
 * @returns {string} Random image URL
 */
export const getRandomBoardImage = (category = "Other") => {
  const categoryImages =
    IMAGE_CATEGORIES[category] || IMAGE_CATEGORIES["Other"];
  const randomIndex = Math.floor(Math.random() * categoryImages.length);
  return categoryImages[randomIndex];
};

/**
 * Get a random image for a kudos card
 * @param {boolean} useGif - Whether to use GIF or static image
 * @returns {string} Random image/GIF URL
 */
export const getRandomCardImage = (useGif = false) => {
  if (useGif) {
    const randomIndex = Math.floor(Math.random() * KUDOS_GIFS.length);
    return KUDOS_GIFS[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * CARD_IMAGES.length);
    return CARD_IMAGES[randomIndex];
  }
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
  return Object.keys(IMAGE_CATEGORIES);
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
