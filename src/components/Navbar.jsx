import React from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    // Sign out of Supabase
    await supabase.auth.signOut();
    // Remove custom token if you're using it
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ borderBottom: "1px solid #ccc", padding: "1rem" }}>
      <Link to="/" style={{ marginLeft: "2rem" }}>
        Home
      </Link>
      {token ? (
        <>
          <span></span>
          <button onClick={handleLogout} style={{ marginLeft: 15}}>Logout</button>
          <Link to="/profile" style={{ marginRight: "1rem", marginLeft: "1rem" }}>
            Profile
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: "1rem" }}>
            Login
          </Link>
          <Link to="/signup" style={{ marginLeft: "1rem" }}>
            Sign Up
          </Link>
          <Link to="/profile" style={{ marginRight: "1rem", marginLeft: "1rem" }}>
            Profile
          </Link>
        </>
      )}


    </nav>
  );
}