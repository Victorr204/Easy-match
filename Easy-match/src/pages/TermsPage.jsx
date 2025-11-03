import React from "react";
import "../styles/easy.css";
import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="page-container">
      <div className="card">
        <h2>Terms of Use</h2>
        <p className="small">Last updated: October 2025</p>

        <p>
          Welcome to <strong>EasyMatch</strong>. By using this platform, you
          agree to these Terms of Use. Please read them carefully before
          creating an account or interacting with others on this platform.
        </p>

        <h4>1. Eligibility</h4>
        <p>You must be at least 18 years old to use EasyMatch.</p>

        <h4>2. Account Responsibility</h4>
        <p>
          You are responsible for maintaining the confidentiality of your
          account. Do not share your login credentials with others.
        </p>

        <h4>3. User Content</h4>
        <p>
          You are solely responsible for the content you upload. Do not post
          misleading, harmful, or explicit material. Violations may result in
          account suspension.
        </p>

        <h4>4. Payments</h4>
        <p>
          Profile posting and unlock fees are non-refundable. Charges are
          clearly displayed before each transaction.
        </p>

        <h4>5. Prohibited Activities</h4>
        <ul>
          <li>Impersonating another user</li>
          <li>Harassment or discrimination</li>
          <li>Fraudulent or illegal behavior</li>
        </ul>

        <h4>6. Disclaimer</h4>
        <p>
          EasyMatch provides a connection platform only. We do not guarantee any
          personal or romantic outcome. Users interact at their own discretion.
        </p>

        <p style={{ marginTop: "1em" }}>
          By continuing to use EasyMatch, you agree to these terms.
        </p>

        <Link to="/" className="btn-primary" style={{ marginTop: 20 }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
