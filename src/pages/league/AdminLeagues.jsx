// src/pages/AdminLeagues.jsx
import React, { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { useNavigate } from "react-router-dom"; // at the top

export default function AdminLeagues() {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const [selectedLeagueId, setSelectedLeagueId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  useEffect(() => {
    async function fetchData() {
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            navigate("/login");
            return;
          }
      
          // Get user profile
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
      
          if (profileError) throw profileError;
          setProfile(profileData);
      
          // ✅ Block access if not admin
          if (profileData.role !== "admin") {
            setError("Access denied: Admins only.");
            setLoading(false);
            return;
          }
      
          // Fetch leagues & teams if admin
          const { data: leaguesData, error: leaguesError } = await supabase
            .from("leagues")
            .select("*");
          if (leaguesError) throw leaguesError;
      
          const { data: teamsData, error: teamsError } = await supabase
            .from("teams")
            .select("*");
          if (teamsError) throw teamsError;
      
          setLeagues(leaguesData || []);
          setTeams(teamsData || []);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
      

    fetchData();
  }, []);

  // Creating a new league
  const handleCreateLeague = async () => {
    if (!newLeagueName) return;
    try {
      const { data, error: createError } = await supabase
        .from("leagues")
        .insert({ name: newLeagueName }) // add more fields if needed
        .select("*");
      if (createError) throw createError;

      alert(`League "${newLeagueName}" created.`);
      setLeagues((prev) => [...prev, ...data]);
      setNewLeagueName("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Assign a team to a league
  const handleAssignTeam = async () => {
    if (!selectedLeagueId || !selectedTeamId) {
      alert("Please select both a league and a team.");
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("teams")
        .update({ league_id: selectedLeagueId })
        .eq("id", selectedTeamId);

      if (updateError) throw updateError;

      alert("Team assigned to league successfully.");
      // Update local state so the UI reflects the new league assignment
      setTeams((prev) =>
        prev.map((t) =>
          t.id === selectedTeamId ? { ...t, league_id: selectedLeagueId } : t
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a league
  const handleDeleteLeague = async (leagueId) => {
    if (!window.confirm("Are you sure you want to delete this league?")) {
      return;
    }
    try {
      // If you want to automatically remove or reassign the teams from that league,
      // do that here. Otherwise, set them to league_id = null
      const { error: unassignError } = await supabase
        .from("teams")
        .update({ league_id: null })
        .eq("league_id", leagueId);
      if (unassignError) throw unassignError;

      // Now delete the league itself
      const { error: delError } = await supabase
        .from("leagues")
        .delete()
        .eq("id", leagueId);
      if (delError) throw delError;

      alert("League deleted.");
      setLeagues((prev) => prev.filter((l) => l.id !== leagueId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading admin leagues...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Admin: Manage Leagues</h2>

      {/* Create league */}
      <div style={{ marginBottom: "1rem" }}>
        <h3>Create New League</h3>
        <input
          type="text"
          placeholder="League name"
          value={newLeagueName}
          onChange={(e) => setNewLeagueName(e.target.value)}
        />
        <button onClick={handleCreateLeague}>Create</button>
      </div>

      {/* Assign a team to a league */}
      <div style={{ marginBottom: "1rem" }}>
        <h3>Assign Team to League</h3>
        <label>Choose League: </label>
        <select
          value={selectedLeagueId}
          onChange={(e) => setSelectedLeagueId(e.target.value)}
        >
          <option value="">-- select league --</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: "1rem" }}>Choose Team: </label>
        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
        >
          <option value="">-- select team --</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <button onClick={handleAssignTeam} style={{ marginLeft: "1rem" }}>
          Assign
        </button>
      </div>

      {/* Show existing leagues + teams in them */}
      <div>
        <h3>Existing Leagues</h3>
        {leagues.length === 0 ? (
          <p>No leagues found.</p>
        ) : (
          leagues.map((league) => (
            <div key={league.id} style={{ border: "1px solid #ccc", margin: "1rem 0" }}>
              <h4>{league.name}</h4>
              <button
                onClick={() => handleDeleteLeague(league.id)}
                style={{ color: "red" }}
              >
                Delete League
              </button>
              {/* If you want to show which teams are in that league: */}
              <p>
                Teams in this league:
                <ul>
                  {teams
                    .filter((t) => t.league_id === league.id)
                    .map((t) => (
                      <li key={t.id}>{t.name}</li>
                    ))}
                </ul>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
