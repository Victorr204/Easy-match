import React, { useState } from "react";
import { createUser } from "../services/appwrite";
import "../styles/easy.css";

export default function RegisterForm({ onClose, refreshAuth }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function doRegister() {
    const { name, email, password } = form;

    if (!name || !email || !password)
      return alert("Please fill all fields");

    setLoading(true);
    try {
      await createUser({ name, email, password });
      alert("✅ Account created successfully!");
      onClose?.();
      refreshAuth?.();
    } catch (err) {
      console.error("Register error:", err);
      alert("❌ " + (err.message || "Error creating account"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Create Account</h3>

      {["name", "email", "password"].map((field) => (
        <div key={field} className="form-row">
          <input
            type={field === "password" ? "password" : "text"}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            value={form[field]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button onClick={doRegister} disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </div>
    </div>
  );
}
