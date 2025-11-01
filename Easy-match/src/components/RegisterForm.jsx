import React, { useState } from "react";
import { createUser } from "../services/appwrite";
import "../styles/easy.css";

export default function RegisterForm({ onClose, refreshAuth }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    location: "",
    gender: "genders",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function doRegister() {
    const { name, age, location, gender, email, password } = form;

    if (!name || !age || !location || !email || !password)
      return alert("Please fill all fields");
    if (Number(age) < 18) return alert("You must be at least 18");

    setLoading(true);
    try {
      await createUser({ name, email, password, age, location, gender });
      alert("✅ Account created successfully!");
      if (onClose) onClose();
      if (refreshAuth) refreshAuth();
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

      {["name", "age", "location", "email", "password"].map((field) => (
        <div key={field} className="form-row">
          <input
            type={field === "password" ? "password" : field === "age" ? "number" : "text"}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            value={form[field]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="form-row">
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="genders">gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button onClick={doRegister} disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </div>
    </div>
  );
}
