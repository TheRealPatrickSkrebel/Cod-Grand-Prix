// src/pages/Invite.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

export default function Invite() {
  // 1) Use useParams() to grab the ":token" from the URL path
  const { token } = useParams();

  // If you need to redirect or manipulate history, import useNavigate
  const navigate = useNavigate();

  // Local state
  const [team, setTeam] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function acceptInvite() {
      try {
        // 2) Check if we actually got a token from the URL
        if (!token) {
          throw new Error("No invite token found in the URL path.");
        }

        // 3) Check if user is logged in
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          setError("You must be logged in to accept an invite.");
          setLoading(false);
          return;
        }

        // 4) Lookup the invitations row by token
        const { data: invites, error: inviteError } = await supabase
          .from("invitations")
          .select("*")
          .eq("token", token)
          .eq("status", "pending");
        if (inviteError) throw inviteError;
        if (!invites || invites.length === 0) {
          throw new Error("Invalid or expired invitation token.");
        }

        const invite = invites[0];

        // 5) Ensure the user’s email matches the invited email
        if (user.email.toLowerCase() !== invite.invitee_email.toLowerCase()) {
          throw new Error("This invitation was sent to a different email address.");
        }

        // 6) Insert membership row in "team_memberships"
        const { error: membershipError } = await supabase
          .from("team_memberships")
          .insert({
            team_id: invite.team_id,
            user_id: user.id,
            role: "player",
          });
        if (membershipError) throw membershipError;

        // 7) Optionally mark the invitation as accepted
        await supabase
          .from("invitations")
          .update({ status: "accepted" })
          .eq("id", invite.id);

        // 8) Fetch the team details
        const { data: teamData, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("id", invite.team_id)
          .single();
        if (teamError) throw teamError;

        setTeam(teamData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    acceptInvite();
  }, [token]);

  if (loading) {
    return <div>Accepting invite...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h2>Invite Accepted!</h2>
      <p>You have joined the team: {team?.name}</p>
      <button onClick={() => navigate(`/teams/${team.id}`)}>
        Go to Team
      </button>
    </div>
  );
}
