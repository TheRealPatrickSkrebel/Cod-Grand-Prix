// src/pages/ConfirmEmail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

export default function ConfirmEmail() {
  const [message, setMessage] = useState("Confirming your email...");
  const navigate = useNavigate();

  useEffect(() => {
    async function confirmEmail() {
      try {
        const hash = window.location.hash.substring(1); // remove the #
        console.log("Hash fragment:", hash); // 👈 ADD THIS LINE
  
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const type = params.get("type");
  
        if (!access_token || !type) {
          throw new Error("Missing access token or type in the confirmation link.");
        }
  
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token: '',
        });
  
        if (error) {
          throw error;
        }
  
        setMessage("✅ Email confirmed! You can now log in.");
      } catch (err) {
        console.error(err);
        setMessage("Error confirming your email: " + err.message);
      }
    }
  
    confirmEmail();
  }, []);
  

  return (
    <div>
      <h1>Confirming Your Email</h1>
      <p>{message}</p>
    </div>
  );
}
