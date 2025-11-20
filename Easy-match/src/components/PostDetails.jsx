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

      const cachedUnlocks = JSON.parse(localStorage.getItem("unlockedPosts") || "[]");
      if (cachedUnlocks.includes(post.$id)) {
        setUnlocked(true);
      }

      try {
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
          const updated = Array.from(new Set([...cachedUnlocks, post.$id]));
          localStorage.setItem("unlockedPosts", JSON.stringify(updated));
        }
      } catch (err) {
        console.error("Check unlock error:", err);
      }
    }

    checkUnlock();
  }, [user, post]);

  // ✅ Unlock handler (with 4% charge)
 async function handleUnlock() {
  if (!user) {
    alert("Please login to unlock contact info.");
    return;
  }

  setProcessing(true);
  try {
    const baseAmount = 500; // NEW PRICE: ₦500 unlock fee
    const charge = baseAmount * 0.04; // NEW 4% processing fee
    const totalAmount = Math.round(baseAmount + charge); // ₦520

    // Step 1: Start Paystack transaction
    const reference = await startPaystackTransaction(
      totalAmount,
      "Unlock contact info",
      { postId: post.$id, userId: user.$id },
      user.email
    );

    if (!reference) {
      alert("Payment could not start or was cancelled.");
      return;
    }

    // Step 2: Verify payment on the server
    const verifyData = await verifyPaymentOnServer(reference, totalAmount);
    if (!verifyData.verified) {
      throw new Error("Payment verification failed. Please try again.");
    }

    // Step 3: Store unlock record in Appwrite
    await databases.createDocument(
      Config.databaseId,
      Config.COLLECTION_PURCHASES,
      ID.unique(),
      {
        buyerId: user.$id,
        postId: post.$id,
        verified: true,
        amount: baseAmount, // store only main fee
        totalPaid: totalAmount, // include fee
        chargeFee: charge,      // 4% charge stored
      }
    );

    // Step 4: Update local cache
    const cachedUnlocks = JSON.parse(localStorage.getItem("unlockedPosts") || "[]");
    const updated = Array.from(new Set([...cachedUnlocks, post.$id]));
    localStorage.setItem("unlockedPosts", JSON.stringify(updated));

    setUnlocked(true);
    alert(`✅ Contact unlocked successfully! You were charged ₦${totalAmount.toLocaleString()}.`);
  } catch (err) {
    console.error("Unlock error:", err);
    alert("Error unlocking contact: " + err.message);
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
                  opacity: 0.9,
                }}
              >
                🔒 <strong>Contact info locked</strong>
                <p style={{ fontSize: "0.9em", marginTop: 5 }}>
                  Pay ₦500 to unlock this user’s contact info.
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
  {processing ? "Processing..." : "Unlock (₦500)"}
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