// src/pages/Leagues.jsx
import React, { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export default function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeagues() {
      try {
        // 1) Query the leagues
        // 2) Also fetch the teams for each league in one go using a relationship
        // if you have a "league_id" in "teams"
        // .select("*, teams(* )") could be used with a foreign key
        // or we can do separate queries.

        // For a simple approach, do two queries:
        const { data: leaguesData, error: leaguesError } = await supabase
          .from("leagues")
          .select("*");
        if (leaguesError) throw leaguesError;

        // Then fetch all teams
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("*");
        if (teamsError) throw teamsError;

        // Combine them: for each league, attach the teams that match league.id
        const leaguesWithTeams = leaguesData.map((league) => {
          const leagueTeams = teamsData.filter(
            (team) => team.league_id === league.id
          );
          return { ...league, teams: leagueTeams };
        });

        setLeagues(leaguesWithTeams);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchLeagues();
  }, []);

  if (loading) return <div>Loading Leagues...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>All Leagues / Divisions</h2>
      {leagues.length === 0 ? (
        <p>No leagues found.</p>
      ) : (
        leagues.map((league) => (
          <div key={league.id} style={{ border: "1px solid #ccc", margin: "1rem" }}>
            <h3>{league.name}</h3>
            <p>{league.description}</p>
            {/* If you track skill_bracket, you could show it: */}
            <p>Skill Bracket: {league.skill_bracket}</p>

            <h4>Teams in {league.name}:</h4>
            {league.teams.length === 0 ? (
              <p>No teams assigned to this league yet.</p>
            ) : (
              <ul>
                {league.teams.map((team) => (
                  <li key={team.id}>{team.name}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
}
