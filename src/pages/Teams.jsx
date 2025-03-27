// src/pages/Teams.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";
import { nanoid } from "nanoid"; // or remove if not needed

// Generate a short unique invite code
function generateInviteCode() {
  return nanoid(8);
  // Or return Math.random().toString(36).substring(2, 10);
}

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // For handling the Create Team form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamData, setNewTeamData] = useState({
    name: "",
    region: "",
    game: "Call of Duty",
  });

  // 1) On mount, fetch current user + existing teams
  useEffect(() => {
    async function fetchData() {
      try {
        // Check for logged in user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error(profileError);
          setLoading(false);
          return;
        }
        setProfile(profileData);

        // Fetch all existing teams from DB
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("*"); // just select all columns

        if (teamsError) {
          console.error(teamsError);
        } else {
          setTeams(teamsData || []);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 2) Handle create team form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTeamData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTeamClick = () => {
    setShowCreateForm(true);
  };

  // 3) Submit new team
  const handleSubmitTeam = async (e) => {
    e.preventDefault();

    try {
      if (!profile) {
        alert("No profile found. Are you logged in?");
        return;
      }

      // Optional: generate an invite code if you want to store it
      const inviteCode = generateInviteCode(); // if your "teams" table has invite_code column

      // Insert a new row in 'teams'
      const { data: insertedTeams, error } = await supabase
        .from("teams")
        .insert({
          name: newTeamData.name,
          region: newTeamData.region,
          game: newTeamData.game || "Call of Duty",
          owner_id: profile.id,
          // invite_code: inviteCode, // Only if your DB has this column
        })
        .select("*");

      if (error) throw error;

      if (insertedTeams && insertedTeams.length > 0) {
        const newTeam = insertedTeams[0];

        // Add a membership row so the captain is on the roster
        const { error: membershipError } = await supabase
          .from("team_memberships")
          .insert({
            team_id: newTeam.id,
            user_id: profile.id,
            role: "captain",
          });

        if (membershipError) {
          console.error("Failed to add captain to team_memberships:", membershipError);
        }

        // Update local state
        setTeams((prev) => [...prev, newTeam]);
      }

      // Reset form + hide
      setNewTeamData({ name: "", region: "", game: "Call of Duty" });
      setShowCreateForm(false);
      alert("Team created successfully!");
    } catch (err) {
      console.error("Error creating team:", err.message);
      alert("Failed to create team: " + err.message);
    }
  };

  // Manage / View
  const handleManageTeam = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  const handleViewTeam = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Teams</h2>

      {profile?.role === "captain" && !showCreateForm && (
        <button onClick={handleCreateTeamClick}>Create Team</button>
      )}

      {profile?.role === "captain" && showCreateForm && (
        <form onSubmit={handleSubmitTeam} style={{ margin: "1rem 0" }}>
          <h3>Create a New COD Team</h3>
          <div>
            <label>Team Name:</label>
            <input
              type="text"
              name="name"
              value={newTeamData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Region (e.g., NA, EU, etc.):</label>
            <input
              type="text"
              name="region"
              value={newTeamData.region}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Game:</label>
            <input type="text" name="game" value={newTeamData.game} readOnly />
          </div>
          <button type="submit">Submit Team</button>
          <button type="button" onClick={() => setShowCreateForm(false)}>
            Cancel
          </button>
        </form>
      )}

      <ul>
        {teams.map((team) => (
          <li key={team.id} style={{ marginBottom: "0.75rem" }}>
            <strong>{team.name}</strong>
            {team.region && ` (${team.region})`}
            {team.game && ` - ${team.game}`}
            {"  "}
            {team.owner_id === profile?.id ? (
              <button onClick={() => handleManageTeam(team.id)}>Manage</button>
            ) : (
              <button onClick={() => handleViewTeam(team.id)}>View</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
