// src/pages/Home.jsx
import React, { useState } from "react";
import "../css/Home.css"; // We'll define some basic styling/animations in Home.css

export default function Home() {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="home-container">
      <h1>Welcome to COD Grand Prix</h1>
      <p>
        Create or join teams, schedule matches, track standings, and compete
        in playoffs.
      </p>
      <p>Please sign up or log in to get started.</p>

      {/* A button to reveal more interactive content */}
      <button className="learn-more-btn" onClick={handleToggleDetails}>
        {showDetails ? "Hide Details" : "Learn More"}
      </button>

      {/* Conditionally render the extra content with a transition */}
      <div className={`details-container ${showDetails ? "open" : ""}`}>
        <h2>How It Works</h2>
        <ol>
          <li>
            <strong>Create a Team:</strong> Gather your squad by creating a new
            team or joining an existing one.
          </li>
          <li>
            <strong>Schedule Matches:</strong> Compete in the regular season
            against other teams with automatically generated match schedules.
          </li>
          <li>
            <strong>Track Standings:</strong> View your position in the league
            tables based on wins, losses, and overall performance.
          </li>
          <li>
            <strong>Playoffs:</strong> When the regular season ends, the top
            teams move on to the playoffs to battle for the championship title!
          </li>
        </ol>
        <p>
          Whether you’re a casual player or a die-hard competitor, COD Grand Prix
          provides a structured path to show off your skills and climb the
          rankings.
        </p>

        {/* Use a Link or a tag for navigation */}
        <p>
        <a className="learn-more-btn" href="/rules">Rules</a>
        </p>

      </div>
    </div>
  );
}
