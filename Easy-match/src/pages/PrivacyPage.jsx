import React from "react";
import "../styles/easy.css";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <div className="page-container">
      <div className="card">
        <h2>Privacy Policy</h2>
        <p className="small">Last updated: October 2025</p>

        <p>
          At <strong>EasyMatch</strong>, your privacy is important to us. This
          policy explains how we collect, use, and protect your personal
          information.
        </p>

        <h4>1. Information We Collect</h4>
        <ul>
          <li>Account details: name, email, and age</li>
          <li>Profile information: photos, bio, and location</li>
          <li>Payment data for verifying transactions</li>
        </ul>

        <h4>2. How We Use Your Data</h4>
        <p>We use your data to:</p>
        <ul>
          <li>Provide and personalize your profile</li>
          <li>Verify payments securely</li>
          <li>Improve app experience and community safety</li>
        </ul>

        <h4>3. Data Sharing</h4>
        <p>
          We do not sell or rent your information. We may share it only with
          secure third-party payment processors (e.g., Paystack) to complete
          transactions.
        </p>

        <h4>4. Data Security</h4>
        <p>
          We use encrypted connections and secure storage to protect your
          personal data. However, no system is completely secure; use caution
          when sharing information.
        </p>

        <h4>5. Your Rights</h4>
        <p>
          You may request to access or delete your data anytime by contacting
          support@easymatch.app.
        </p>

        <Link to="/" className="btn-primary" style={{ marginTop: 20 }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
