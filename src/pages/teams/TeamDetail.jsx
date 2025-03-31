// src/pages/TeamDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../lib/supabase";
import emailjs from "emailjs-com";
import '../../css/teams/roster.css'

// socials
import discordImage from '../../assets/socials/discord.png'
import activisionImage from '../../assets/socials/letter-a.png'
import playstationImage from '../../assets/socials/playstation.png'
import xboxImage from '../../assets/socials/xbox.png'

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [roster, setRoster] = useState([]);
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [profile, setProfile] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const SERVICE_ID = "service_04sho4m";
  const TEMPLATE_ID = "template_yzt9bcg";
  const USER_ID = "9RcaQkQ0RW98SMtoy";

  useEffect(() => {
    async function fetchTeamAndRoster() {
      try {
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

        const { data: teamData, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("id", id)
          .single();
        if (teamError) throw teamError;
        setTeam(teamData);

        const { data: membershipData, error: membershipError } = await supabase
          .from("team_memberships")
          .select("id, role, user_id, user:profiles(id, username, discord, activision, xbox, playstation)")
          .eq("team_id", id);
        if (membershipError) throw membershipError;
        setRoster(membershipData);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchTeamAndRoster();
  }, [id]);

  const isCaptain = profile && team && team.owner_id === profile.id;

  const handleInviteByEmail = async () => {
    try {
      if (!inviteEmail) {
        alert("Please enter an email");
        return;
      }

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

      const token = crypto.randomUUID();

      const { error: inviteError } = await supabase
        .from("invitations")
        .insert({
          team_id: id,
          invitee_email: inviteEmail,
          token,
          status: "pending",
        });
      if (inviteError) throw inviteError;

      const inviteLink = `https://codgrandprix.vercel.app//invite/${token}`;

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

  const handleDisbandTeam = async () => {
    try {
      const { error: membershipDelError } = await supabase
        .from("team_memberships")
        .delete()
        .eq("team_id", id);
      if (membershipDelError) throw membershipDelError;

      const { error: invitesDelError } = await supabase
        .from("invitations")
        .delete()
        .eq("team_id", id);
      if (invitesDelError) throw invitesDelError;

      const { error: teamDelError } = await supabase
        .from("teams")
        .delete()
        .eq("id", id);
      if (teamDelError) throw teamDelError;

      alert("Team disbanded successfully.");
      navigate("/teams");
    } catch (err) {
      console.error("Error disbanding team:", err);
      setError(err.message);
    }
  };

  const popUpDeleteTeam = () => (
    <div className="popup-overlay">
      <div className="popup-card">
        <div className="popup-header">
          <div className="popup-icon">
            <svg stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <div className="popup-content">
            <h3>Disband Team</h3>
            <p>Are you sure you want to disband this team? This action cannot be undone.</p>
          </div>
          <div className="popup-actions">
            <button className="desactivate" onClick={handleDisbandTeam}>Yes, Disband</button>
            <button className="cancel" onClick={() => setShowDeletePopup(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!team) return <div>Loading team details...</div>;

  return (
    <div className="team-detail-container">
      <h2>{team.name}</h2>
      <p>Game: {team.game}</p>

      <h3>Roster</h3>
      <div className="roster-list">
        {roster.length === 0 && <p>No members yet</p>}
        {roster.map((member) => (
          <div key={member.id} className="card-client">
            <div className="user-picture">
              <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"></path>
              </svg>
            </div>
            <p className="name-client">{member.user?.username || "Unknown User"}
              <span>{member.role && ` ${member.role}`}</span>
            </p>
            <div className="social-media">
              <a href="#"><img src={discordImage} alt="Discord" className="social-icon" /><span className="tooltip-social">Discord {member.user?.discord}</span></a>
              <a href="#"><img src={activisionImage} alt="Activision" className="social-icon" /><span className="tooltip-social">Activision {member.user?.activision}</span></a>
              <a href="#"><img src={xboxImage} alt="Xbox" className="social-icon" /><span className="tooltip-social">Xbox {member.user?.xbox}</span></a>
              <a href="#"><img src={playstationImage} alt="Playstation" className="social-icon" /><span className="tooltip-social">Playstation {member.user?.playstation}</span></a>
            </div>
          </div>
        ))}
      </div>

      {isCaptain && (
        <div className="captain-controls">
          <h4>Invite a new player by email</h4>
          <input className="input" type="email" placeholder="Email address" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <br/>
          <button onClick={handleInviteByEmail} className="cta">
            <span>Invite</span>
            <svg width="15px" height="10px" viewBox="0 0 13 10">
              <path d="M1,5 L11,5"></path>
              <polyline points="8 1 12 5 8 9"></polyline>
            </svg>
          </button>

          <button onClick={() => setShowDeletePopup(true)} className="desactivate" style={{ marginTop: "1rem" }}>Disband Team</button>
        </div>
      )}

      {showDeletePopup && popUpDeleteTeam()}
    </div>
  );
}
