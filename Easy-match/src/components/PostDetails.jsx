import React, { useState, useEffect } from "react";
import { databases, ID, Query, Config } from "../services/appwrite";
import { startPaystackTransaction, verifyPaymentOnServer } from "../services/paystack";
import "../styles/easy.css";

export default function PostDetails({ post, user, onClose, refreshPosts }) {
  const [processing, setProcessing] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // ✅ Check if post is unlocked (localStorage + Appwrite)
  useEffect(() => {
    async function checkUnlock() {
      if (!user) return;

      // Check local cache
      const cachedUnlocks = JSON.parse(localStorage.getItem("unlockedPosts") || "[]");
      if (cachedUnlocks.includes(post.$id)) {
        setUnlocked(true);
      }

      try {
        // Check Appwrite database
        const res = await databases.listDocuments(
          Config.databaseId,
          Config.COLLECTION_PURCHASES,
          [
            Query.equal("buyerId", user.$id),
            Query.equal("postId", post.$id),
            Query.equal("verified", true),
          ]
        );

        if (res.total > 0) {
          setUnlocked(true);

          // Sync to local cache
          const updated = Array.from(new Set([...cachedUnlocks, post.$id]));
          localStorage.setItem("unlockedPosts", JSON.stringify(updated));
        }
      } catch (err) {
        console.error("Check unlock error:", err);
      }
    }

    checkUnlock();
  }, [user, post]);

  // ✅ Unlock handler
async function handleUnlock() {
  if (!user) {
    alert("Please login to unlock contact info.");
    return;
  }

  setProcessing(true);
  try {
    // ✅ Call backend to initialize Paystack transaction
    const res = await fetch("https://easy-match-backend.vercel.app/api/paystack/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.$id,
        email: user.email,
        postId: post.$id,
        amount: 1500, // ₦1,500 unlock fee
      }),
    });

    const data = await res.json();
    if (!data || !data.authorization_url) {
      alert("Unable to start payment.");
      return;
    }

    // ✅ Redirect user to Paystack payment page
    window.location.href = data.authorization_url;

  } catch (err) {
    console.error("Payment error:", err);
    alert("Error starting payment: " + (err.message || err));
  } finally {
    setProcessing(false);
  }
}


  // ✅ Build contact links
  const whatsappLink = post.whatsapp
    ? `https://wa.me/${post.whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  const instagramLink = post.instagram
    ? post.instagram.startsWith("http")
      ? post.instagram
      : `https://instagram.com/${post.instagram.replace("@", "")}`
    : null;

  // ✅ Correct image URL for Appwrite 1.5+
  const imageUrl = post.imageFileId
    ? `${Config.endpoint}/storage/buckets/${Config.photoBucketId}/files/${post.imageFileId}/view?project=${Config.projectId}`
    : "https://via.placeholder.com/300x200?text=No+Photo";

  return (
    <div>
      <div style={{ display: "flex", gap: 12 }}>
        {/* 🖼️ Profile Image */}
        <div style={{ flex: "0 0 180px" }}>
          <img
            src={imageUrl}
            alt={post.displayName}
            style={{
              width: 180,
              height: 350,
              objectFit: "cover",
              borderRadius: 8,
              transition: "0.3s ease",
            }}
          />
        </div>

        {/* 📋 Profile Info */}
        <div style={{ flex: 1 }}>
          <h3>{post.displayName}</h3>
          <div className="small">{post.age} years old</div>

          <div style={{ marginTop: 8 }}>
            <strong>About:</strong>
            <div>{post.bio || post.description || "—"}</div>
          </div>

          {/* 🔒 Locked / Unlocked Contact Info */}
          <div style={{ marginTop: 12 }}>
            {!unlocked ? (
              <div
                style={{
                  marginTop: 10,
                  background: "#f8f8f8",
                  padding: "10px",
                  borderRadius: 8,
                  textAlign: "center",
                  opacity: 0.8,
                }}
              >
                🔒 <strong>Contact info locked</strong>
                <p style={{ fontSize: "0.9em", marginTop: 5 }}>
                  Pay ₦1,500 to unlock this user’s contact information.
                </p>
                <button
                  onClick={handleUnlock}
                  disabled={processing}
                  style={{
                    marginTop: 5,
                    padding: "8px 14px",
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  {processing ? "Processing..." : "Unlock (₦1,500)"}
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                <div>
                  <strong>Phone:</strong>{" "}
                  {post.phone ? (
                    <a href={`tel:${post.phone}`} target="_blank" rel="noreferrer">
                      {post.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>

                <div>
                  <strong>WhatsApp:</strong>{" "}
                  {whatsappLink ? (
                    <a href={whatsappLink} target="_blank" rel="noreferrer">
                      Chat on WhatsApp
                    </a>
                  ) : (
                    "—"
                  )}
                </div>

                <div>
                  <strong>Instagram:</strong>{" "}
                  {instagramLink ? (
                    <a href={instagramLink} target="_blank" rel="noreferrer">
                      Visit Instagram Profile
                    </a>
                  ) : (
                    "—"
                  )}
                </div>

                <div>
                  <strong>Location:</strong> {post.location || "—"}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div style={{ marginTop: 14 }}>
            <button
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                background: "#ccc",
                border: "none",
              }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
