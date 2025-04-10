import React from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";
import '../css/navbar.css';
import Banner from '../assets/NullZone.png'; // Update the path to match your project
import { CgProfile } from "react-icons/cg";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
         <img src={Banner} alt="CoD Grand Prix" className="navbar-logo" />
        </Link>

      </div>
      <div className="navbar-right">
        {token ? (
          <>
          <Link to="/profile" className="profile-icon">
            <CgProfile />
          </Link>

            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>
    </nav>
  );
}
