// components/Modal.jsx
import React from "react";
import "../styles/modal.css";

export default function Modal({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-inner"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body">{children}</div>
        <div style={{ textAlign: "right", marginTop: 12 }}>
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

