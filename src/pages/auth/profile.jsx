// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // import navigate
import supabase from "../../lib/supabase";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [isOnTeam, setIsOnTeam] = useState(false); // whether user is on a team

  const navigate = useNavigate(); // to redirect if logged out

  // Local state for the form
  const [formData, setFormData] = useState({
    free_agent: true,
    discord: "",
    activision: "",
    xbox: "",
    playstation: "",
  });

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      // else fetch profile, etc.
    }
    checkSession();
  }, [navigate]);
  

  useEffect(() => {
    async function fetchProfileAndTeams() {
      try {
        // 1) Get the current user from Supabase Auth
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        // If no user found, redirect to /login immediately
        if (!user) {
          setLoading(false);
          navigate("/login");
          return; // stop here so we don't fetch profile or anything
        }

        // 2) Fetch the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }
        setProfile(profileData);

        // 3) Check if user is on a team (adjust to your schema)
        const { data: membershipData, error: membershipError } = await supabase
          .from("team_memberships")
          .select("*")
          .eq("user_id", user.id);

        if (membershipError) {
          throw membershipError;
        }

        // If membershipData is not empty, user is on a team
        const hasTeam = membershipData && membershipData.length > 0;
        setIsOnTeam(hasTeam);

        // 4) Populate form data from the profile
        setFormData({
          free_agent: profileData.free_agent,
          discord: profileData.discord || "",
          activision: profileData.activision || "",
          xbox: profileData.xbox || "",
          playstation: profileData.playstation || "",
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchProfileAndTeams();
  }, [navigate]);

  // Handle changes in the form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // If user is on a team, do not allow them to become a free agent
      let freeAgentToSave = formData.free_agent;
      if (isOnTeam) {
        // Force free_agent to be false if user is on a team
        freeAgentToSave = false;
      }

      // Update the profile in DB
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          free_agent: freeAgentToSave,
          discord: formData.discord,
          activision: formData.activision,
          xbox: formData.xbox,
          playstation: formData.playstation,
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      // Reflect changes in state
      setProfile((prev) => ({
        ...prev,
        free_agent: freeAgentToSave,
        discord: formData.discord,
        activision: formData.activision,
        xbox: formData.xbox,
        playstation: formData.playstation,
      }));

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile) return <div>No profile found.</div>; // in case there's no data

  return (
    <div>
      <h1>Profile of {profile.username}</h1>
      <form onSubmit={handleSave} style={{ marginTop: "1rem" }}>
        {/* Free Agent Toggle */}
        <div>
          <label>
            <input
              type="checkbox"
              name="free_agent"
              checked={formData.free_agent}
              onChange={handleChange}
              disabled={isOnTeam}
            />
            Free Agent
          </label>
          {isOnTeam && (
            <p style={{ color: "gray" }}>
              You are currently on a team, so you cannot be a free agent.
            </p>
          )}
        </div>

        {/* Discord */}
        <div>
          <label>Discord Username:</label>
          <input
            type="text"
            name="discord"
            value={formData.discord}
            onChange={handleChange}
          />
        </div>

        {/* Activision */}
        <div>
          <label>Activision ID:</label>
          <input
            type="text"
            name="activision"
            value={formData.activision}
            onChange={handleChange}
          />
        </div>

        {/* Xbox */}
        <div>
          <label>Xbox Gamertag:</label>
          <input
            type="text"
            name="xbox"
            value={formData.xbox}
            onChange={handleChange}
          />
        </div>

        {/* PlayStation */}
        <div>
          <label>PlayStation ID:</label>
          <input
            type="text"
            name="playstation"
            value={formData.playstation}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Save
        </button>
      </form>
    </div>
  );
}
