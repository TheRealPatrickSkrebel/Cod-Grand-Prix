// src/pages/Matches.jsx
import React, { useState, useEffect } from "react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [scoreData, setScoreData] = useState({ homeScore: "", awayScore: "" });
  const [selectedMatch, setSelectedMatch] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/matches", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error(err));
  }, [token]);

  const openScoreModal = (match) => {
    setSelectedMatch(match);
    setScoreData({ homeScore: match.homeScore || "", awayScore: match.awayScore || "" });
  };

  const handleScoreUpdate = async () => {
    if (!selectedMatch) return;
    try {
      const response = await fetch(`/api/matches/${selectedMatch.id}/score`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scoreData),
      });
      if (!response.ok) {
        throw new Error("Failed to update score");
      }
      // Update local matches array with new score
      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (m.id === selectedMatch.id) {
            return { ...m, homeScore: scoreData.homeScore, awayScore: scoreData.awayScore };
          }
          return m;
        })
      );
      setSelectedMatch(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Matches</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.id} style={{ marginBottom: "1rem" }}>
            <strong>{match.homeTeam?.name} vs {match.awayTeam?.name}</strong> 
            <br />
            Scheduled: {match.scheduledAt}
            <br />
            Score: {match.homeScore} - {match.awayScore}
            <br />
            <button onClick={() => openScoreModal(match)}>Update Score</button>
          </li>
        ))}
      </ul>

      {/* Simple "modal" or pop-up for updating scores */}
      {selectedMatch && (
        <div style={{ border: "1px solid #333", padding: "1rem" }}>
          <h3>Update Score for Match #{selectedMatch.id}</h3>
          <div>
            <label>Home Score</label>
            <input
              type="number"
              value={scoreData.homeScore}
              onChange={(e) => setScoreData({ ...scoreData, homeScore: e.target.value })}
            />
          </div>
          <div>
            <label>Away Score</label>
            <input
              type="number"
              value={scoreData.awayScore}
              onChange={(e) => setScoreData({ ...scoreData, awayScore: e.target.value })}
            />
          </div>
          <button onClick={handleScoreUpdate}>Save</button>
          <button onClick={() => setSelectedMatch(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
