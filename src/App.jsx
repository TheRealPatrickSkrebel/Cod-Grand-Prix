// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/sideBar";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Matches from "./pages/Matches";
import NotFound from "./pages/NotFound";

import ConfirmEmail from "./pages/confirmEmail";

import Profile from "./pages/auth/profile";

import Rules from "./pages/rules";
import Invite from "./pages/Invite";

// Example: Protected Route wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  // If no token, redirect to Login
  return token ? children : <Navigate to="/login" />;
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

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<NotFound />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
        </Routes>
      </div>
    </div>
  );
}
