// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/sideBar";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Teams from "./pages/teams/Teams";
import TeamDetail from "./pages/teams/TeamDetail";
import Matches from "./pages/league/Matches";
import NotFound from "./pages/NotFound";

import ConfirmEmail from "./pages/confirmEmail";

import Profile from "./pages/auth/profile";

import Rules from "./pages/rules";
import Invite from "./pages/Invite";

import AdminLeagues from "./pages/league/AdminLeagues"
import League from "./pages/league/Leagues"

import AdminRoute from "./components/AdminRoute";


// Example: Protected Route wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  // If no token, redirect
  if (!token) return <Navigate to="/login" />;

  // ... also fetch the user and check if role === admin. 
  // If not admin, redirect or display "Forbidden" message
  // Or create a separate AdminRoute if you prefer.
  
  return children;
}


export default function App() {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/rules" element={<Rules />} />
          <Route path="/invite/:token" element={<Invite />} />

          <Route path="/admin/leagues" element={<League />} />

          {/* Protected routes require a valid token */}
          <Route
            path="/teams"
            element={
              <PrivateRoute>
                <Teams />
              </PrivateRoute>
            }
          />
          <Route
            path="/teams/:id"
            element={
              <PrivateRoute>
                <TeamDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <PrivateRoute>
                <Matches />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/adminleagues"
            element={
              <AdminRoute>
                <AdminLeagues />
              </AdminRoute>
            }
          />


          {/* Catch-all for undefined routes */}
          <Route path="*" element={<NotFound />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
        </Routes>
      </div>
    </div>
  );
}
