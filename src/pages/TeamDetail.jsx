// src/pages/TeamDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";
import emailjs from "emailjs-com";

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [roster, setRoster] = useState([]);
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [profile, setProfile] = useState(null);

  const SERVICE_ID = "service_04sho4m";
  const TEMPLATE_ID = "template_yzt9bcg";
  const USER_ID = "9RcaQkQ0RW98SMtoy";

  useEffect(() => {
    async function fetchTeamAndRoster() {
      try {
        // get current user + profile
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          setProfile(profileData);
        }

        // get the team
        const { data: teamData, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("id", id)
          .single();
        if (teamError) throw teamError;
        setTeam(teamData);

        // get the roster
        const { data: membershipData, error: membershipError } = await supabase
          .from("team_memberships")
          .select("id, role, user_id, user:profiles(id, username)")
          .eq("team_id", id);
        if (membershipError) throw membershipError;
        setRoster(membershipData);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchTeamAndRoster();
  }, [id]);

  // Check if current user is the team captain
  const isCaptain = profile && team && team.owner_id === profile.id;

  // Captain invites a user by email
  const handleInviteByEmail = async () => {
    try {
      if (!inviteEmail) {
        alert("Please enter an email");
        return;
      }

      // Check if there's already a pending invitation
      const { data: existingInvites, error: checkError } = await supabase
        .from("invitations")
        .select("*")
        .eq("team_id", id)
        .eq("invitee_email", inviteEmail)
        .eq("status", "pending");
      if (checkError) throw checkError;
      if (existingInvites && existingInvites.length > 0) {
        throw new Error("That email has already been invited to this team!");
      }

      // generate a token
      const token = crypto.randomUUID();

      // insert invitation
      const { error: inviteError } = await supabase
        .from("invitations")
        .insert({
          team_id: id,
          invitee_email: inviteEmail,
          token,
          status: "pending",
        });
      if (inviteError) throw inviteError;

      // construct the invite link
      const inviteLink = `http://localhost:5173/invite/${token}`;

      // send email
      const templateParams = {
        to_email: inviteEmail,
        subject: `Invite to Join Team ${team.name}`,
        invite_link: inviteLink,
      };

      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        USER_ID
      );
      console.log("EmailJS response:", response);

      alert(`Invite sent to ${inviteEmail}. Link: ${inviteLink}`);
      setInviteEmail("");
    } catch (err) {
      console.error("handleInviteByEmail error:", err);
      setError(err.message);
    }
  };

  // Disband the team if the captain chooses
  const handleDisbandTeam = async () => {
    if (!window.confirm("Are you sure you want to disband this team?")) {
      return; // user canceled
    }

    try {
      // 1) remove memberships
      const { error: membershipDelError } = await supabase
        .from("team_memberships")
        .delete()
        .eq("team_id", id);

      if (membershipDelError) throw membershipDelError;

      // 2) remove invitations
      const { error: invitesDelError } = await supabase
        .from("invitations")
        .delete()
        .eq("team_id", id);

      if (invitesDelError) throw invitesDelError;

      // 3) remove the team
      const { error: teamDelError } = await supabase
        .from("teams")
        .delete()
        .eq("id", id);

      if (teamDelError) throw teamDelError;

      alert("Team disbanded successfully.");
      navigate("/teams"); // go back to the teams list
    } catch (err) {
      console.error("Error disbanding team:", err);
      setError(err.message);
    }
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!team) return <div>Loading team details...</div>;

  return (
    <div>
      <h2>{team.name}</h2>
      <p>Owner ID: {team.owner_id}</p>
      <p>Region: {team.region}</p>
      <p>Game: {team.game}</p>

      <h3>Roster</h3>
      <ul>
        {roster.length === 0 && <li>No members yet</li>}
        {roster.map((member) => (
          <li key={member.id}>
            {member.user?.username || "Unknown User"}
            {member.role && ` (${member.role})`}
          </li>
        ))}
      </ul>

      {isCaptain && (
        <>
          <div style={{ marginTop: "1rem" }}>
            <h4>Invite a new player by email</h4>
            <input
              type="email"
              placeholder="someone@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button onClick={handleInviteByEmail}>Invite</button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button onClick={handleDisbandTeam} style={{ color: "red" }}>
              Disband Team
            </button>
          </div>
        </>
      )}
    </div>
  );
}
