import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Kudos Board</h4>
            <p>Celebrate achievements and recognize great work</p>
          </div>

          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Create & Edit Boards</li>
              <li>Search & Filter</li>
              <li>Real-time Updates</li>
              <li>Mobile Friendly</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Quick Actions</h4>
            <ul>
              <li>View All Boards</li>
              <li>Recent Boards</li>
              <li>Create New Board</li>
              <li>Search Boards</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>About</h4>
            <p>Built with React and Express</p>
            <p>Designed for team collaboration</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {currentYear} Kudos Board. Made with ❤️ for celebrating
            achievements.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
