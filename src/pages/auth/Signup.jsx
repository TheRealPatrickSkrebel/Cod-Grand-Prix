// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabase";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "player", // default to player if they don't choose
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    setError("");

    try {
      // 1) Create a new user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) {
        throw signUpError;
      }

      const user = data?.user;
      if (!user) {
        throw new Error("No user returned after sign up");
      }

      // 2) Insert/Upsert a corresponding row in 'profiles' table
      //    Use user.email (the actual Auth email) so that profiles.email
      //    exactly matches the email in auth.users
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert([
          {
            id: user.id,              // same UUID as in auth.users
            username: formData.username,
            email: user.email,        // force the email to match Auth's email
            role: formData.role,
          },
        ]);

      if (profileError) {
        throw profileError;
      }

      // 3) Redirect to login
      navigate("/login");

      setIsSubmitting(false);
    } catch (err) {
      console.error("Signup error:", err);

      if (err.message === "Email already registered") {
        setError("This email is already in use. Please try logging in.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Username</label>
          <input
            name="username"
            onChange={handleChange}
            value={formData.username}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>

        {/* Role Selection */}
        <div>
          <label>Select Role:</label>
          <div>
            <input
              type="radio"
              name="role"
              value="captain"
              checked={formData.role === "captain"}
              onChange={handleChange}
              id="role-captain"
            />
            <label htmlFor="role-captain">Team Captain</label>
          </div>
          <div>
            <input
              type="radio"
              name="role"
              value="player"
              checked={formData.role === "player"}
              onChange={handleChange}
              id="role-player"
            />
            <label htmlFor="role-player">Player</label>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
