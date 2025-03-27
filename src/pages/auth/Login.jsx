// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabase";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1) Sign in using Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      // 2) Supabase manages the session automatically,
      //    but we also set a placeholder token so PrivateRoute sees we're "logged in"
      if (data.session) {
        // You can store a real token or just a dummy string:
        localStorage.setItem("token", "loggedIn");
      } else {
        // If there's no session, it might be an unconfirmed email scenario
        throw new Error("Email not confirmed");
      }

      // 3) Navigate user to /teams (protected route)
      navigate("/teams");
    } catch (err) {
      if (err.message === "Email not confirmed") {
        setError(
          <>
            {err.message}.{" "}
            <button
              onClick={async () => {
                try {
                  // Attempt to resend confirmation email
                  const { error: resendError } = await supabase.auth.resend({
                    email: formData.email,
                    type: "signup"
                  });
                  if (resendError) {
                    setError(resendError.message);
                  } else {
                    setError(
                      `Confirmation email resent to ${formData.email}. Please check your inbox.`
                    );
                  }
                } catch (resendErr) {
                  setError(resendErr.message);
                }
              }}
            >
              Resend Confirmation Email
            </button>
          </>
        );
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
