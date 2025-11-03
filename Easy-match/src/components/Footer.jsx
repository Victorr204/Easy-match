import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.links}>
        <Link to="/terms" style={styles.link}>Terms of Use</Link>
        <Link to="/privacy" style={styles.link}>Privacy Policy</Link>
        <Link to="/cookies" style={styles.link}>Cookies Policy</Link>
      </div>
      <div style={styles.copy}>
        © {new Date().getFullYear()} EasyMatch. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    textAlign: "center",
    padding: "20px",
    marginTop: "40px",
    borderTop: "1px solid #ccc",
    backgroundColor: "#fafafa",
    fontSize: "14px",
  },
  links: {
    marginBottom: "8px",
  },
  link: {
    margin: "0 10px",
    color: "#007bff",
    textDecoration: "none",
  },
  copy: {
    color: "#555",
  },
};
