import React, { useState, useEffect } from "react";
import { searchGifs } from "../utils/randomImages";

const GifSearchModal = ({ isOpen, onClose, onSelectGif }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setGifs([]);
      return;
    }

    console.log("Searching for:", query); // Debug log
    setLoading(true);
    setError("");

    try {
      console.log("API Key available:", !!process.env.REACT_APP_GIPHY_API_KEY); // Debug log
      const results = await searchGifs(query, 12);
      console.log("Search results:", results); // Debug log
      setGifs(results);
      if (results.length === 0) {
        setError(
          "No GIFs found for this search term. Try a different keyword."
        );
      }
    } catch (err) {
      setError("Failed to search GIFs. Please try again.");
      console.error("GIF search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Use useEffect for debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setGifs([]);
        setError("");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleGifSelect = (gif) => {
    onSelectGif(gif.url);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setGifs([]);
    setError("");
    onClose();
  };

  // Load trending GIFs when modal opens
  useEffect(() => {
    if (isOpen && gifs.length === 0 && !searchQuery) {
      handleSearch("celebration");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="gif-search-modal-overlay" onClick={handleClose}>
      <div className="gif-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gif-search-header">
          <h3>Search for GIFs</h3>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="gif-search-input-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for GIFs (e.g., celebration, thank you, success...)"
            className="gif-search-input"
            autoFocus
          />
        </div>

        <div className="gif-search-content">
          {loading && (
            <div className="gif-search-loading">
              <div className="loading-spinner"></div>
              <p>Searching for GIFs...</p>
            </div>
          )}

          {error && (
            <div className="gif-search-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && gifs.length > 0 && (
            <div className="gif-grid">
              {gifs.map((gif) => (
                <div
                  key={gif.id}
                  className="gif-item"
                  onClick={() => handleGifSelect(gif)}
                  title={gif.title}
                >
                  <img src={gif.preview} alt={gif.title} loading="lazy" />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && gifs.length === 0 && searchQuery && (
            <div className="gif-search-empty">
              <p>No GIFs found. Try a different search term.</p>
            </div>
          )}

          {!loading && !searchQuery && gifs.length === 0 && (
            <div className="gif-search-placeholder">
              <p>Enter a search term to find GIFs</p>
              <p className="gif-search-suggestions">
                Try: celebration, thank you, success, teamwork, achievement
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .gif-search-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .gif-search-modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .gif-search-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .gif-search-header h3 {
          margin: 0;
          color: #333;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .close-button:hover {
          background-color: #f0f0f0;
        }

        .gif-search-input-container {
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .gif-search-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
        }

        .gif-search-input:focus {
          border-color: #007bff;
        }

        .gif-search-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .gif-search-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .gif-search-error {
          text-align: center;
          padding: 40px;
          color: #e74c3c;
        }

        .gif-search-empty,
        .gif-search-placeholder {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .gif-search-suggestions {
          font-size: 14px;
          color: #999;
          margin-top: 8px;
        }

        .gif-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
        }

        .gif-item {
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          background: #f8f9fa;
        }

        .gif-item:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .gif-item img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          display: block;
        }

        /* Dark theme support */
        @media (prefers-color-scheme: dark) {
          .gif-search-modal {
            background: #2d3748;
            color: white;
          }

          .gif-search-header {
            border-bottom-color: #4a5568;
          }

          .gif-search-input-container {
            border-bottom-color: #4a5568;
          }

          .gif-search-input {
            background: #4a5568;
            border-color: #718096;
            color: white;
          }

          .gif-search-input:focus {
            border-color: #63b3ed;
          }

          .close-button:hover {
            background-color: #4a5568;
          }

          .gif-item {
            background: #4a5568;
          }
        }
      `}</style>
    </div>
  );
};

export default GifSearchModal;
