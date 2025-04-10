// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/sidebar.css"; // Assuming you have some CSS for styling
import supabase from "../lib/supabase"; // adjust path as needed


export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userRole, setUserRole] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    async function fetchUserRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
  
        if (profile?.role) {
          setUserRole(profile.role);
        }
      }
    }
  
    fetchUserRole();
  }, []);

  return (
    <>
      {/* TOP HEADER */}
      <header className="top-header">
        {/* Hamburger Button at the left */}
        <button
          className="drawer-toggle"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          ☰
        </button>



        {/* Some space to the right for quick links or nothing – your choice */}
        <div className="header-right">
          {/* You could add a quick link or user info here if you want */}
        </div>
      </header>

      {/* LEFT DRAWER */}
      <nav className={`drawer ${drawerOpen ? "open" : ""}`}>
        <button
          className="close-button"
          onClick={() => setDrawerOpen(false)}
        >
          ✕
        </button>
        <ul>
          <li>
            <Link to="/" onClick={() => setDrawerOpen(false)}>
              Home
            </Link>
          </li>
          <li>
          <Link to="/teams" style={{ marginRight: "1rem", marginLeft: "1rem" }}>
            Teams
          </Link>
          </li>
          <li>
          <Link to="/matches" style={{ marginRight: "1rem" }}>
            Matches
          </Link>
          </li>
          <li>
            <Link to="/admin/leagues" onClick={() => setDrawerOpen(false)}>
              Leaderboard
            </Link>
          </li>
          {userRole === "admin" && (
            <li>
              <Link to="/admin/Adminleagues" onClick={() => setDrawerOpen(false)}>
                Admin Leagues
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
