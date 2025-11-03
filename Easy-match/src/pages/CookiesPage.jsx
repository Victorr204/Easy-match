import React from "react";
import "../styles/easy.css";
import { Link } from "react-router-dom";

export default function CookiesPage() {
  return (
    <div className="page-container">
      <div className="card">
        <h2>Cookies Policy</h2>
        <p className="small">Last updated: October 2025</p>

        <p>
          At <strong>EasyMatch</strong>, we use cookies and similar technologies
          to improve your experience, deliver relevant advertising, and ensure
          our website functions properly.
        </p>

        <h4>1. What Are Cookies?</h4>
        <p>
          Cookies are small text files stored on your device that help websites
          remember information about your visit. They are used to make our
          website more efficient and to provide personalized content.
        </p>

        <h4>2. Types of Cookies We Use</h4>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Required for the website to
            function (e.g., login, security, and navigation).
          </li>
          <li>
            <strong>Preference Cookies:</strong> Remember your settings such as
            dark mode and language preferences.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how visitors
            use our site and improve usability.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Used to show you ads that are
            relevant to your interests and measure ad performance. These may be
            set by EasyMatch or trusted third-party partners (e.g., Google
            AdSense).
          </li>
        </ul>

        <h4>3. Advertising and Third-Party Cookies</h4>
        <p>
          We partner with advertising networks and analytics providers who may
          use cookies to collect data about your browsing behavior across
          websites. This data helps serve personalized or non-personalized ads
          based on your preferences.
        </p>
        <p>
          Third-party cookies are subject to their own privacy policies. You can
          learn more about how Google uses data from cookies by visiting{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google’s Advertising Policy
          </a>
          .
        </p>

        <h4>4. Managing Cookies</h4>
        <p>
          You can control or delete cookies through your browser settings. Most
          browsers allow you to:
        </p>
        <ul>
          <li>Delete existing cookies</li>
          <li>Block third-party cookies</li>
          <li>Receive a warning before cookies are stored</li>
        </ul>
        <p>
          Please note that disabling cookies may affect site functionality or
          limit access to certain features.
        </p>

        <h4>5. Consent</h4>
        <p>
          By continuing to use EasyMatch, you consent to our use of cookies in
          accordance with this policy. You can change your cookie preferences at
          any time through your browser or device settings.
        </p>

        <h4>6. Updates to This Policy</h4>
        <p>
          We may occasionally update this Cookies Policy to reflect changes in
          our practices or to comply with legal requirements. Any updates will
          be posted here with a new “Last updated” date.
        </p>

        <p style={{ marginTop: "1em" }}>
          For more details, see our{" "}
          <Link to="/privacy">Privacy Policy</Link> and{" "}
          <Link to="/terms">Terms of Use</Link>.
        </p>

        <Link to="/" className="btn-primary" style={{ marginTop: 20 }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
