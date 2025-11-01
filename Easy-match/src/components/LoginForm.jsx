import React, { useState } from "react";
import { account } from "../services/appwrite";
import "../styles/easy.css";

export default function LoginForm({ onClose, refreshAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login
  const doLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      // ✅ Create session using Appwrite
      await account.createEmailPasswordSession(email, password);

      alert("Login successful ✅");

      // Optional callbacks for closing modal or refreshing auth state
      onClose?.();
      refreshAuth?.();
    } catch (err) {
      console.error("Login failed:", err);
      alert(`Login failed: ${err.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h3>Login</h3>

      <div className="form-row">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div style={{ textAlign: "right" }}>
        <button onClick={doLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
