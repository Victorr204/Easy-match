import React, { useEffect, useState } from "react";
import { databases, Query, Config } from "../services/appwrite";
import "../styles/easy.css";

export default function MyPurchases({ user, onClose }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadPurchases();
  }, [user]);

  async function loadPurchases() {
    try {
      setLoading(true);

      // 1️⃣ Get all purchases where the logged-in user is the buyer
      const list = await databases.listDocuments(
        Config.databaseId,
        Config.COLLECTION_PURCHASES,
        [Query.equal("buyerId", user.$id), Query.equal("verified", true)]
      );

      if (list.total === 0) {
        setPurchases([]);
        setLoading(false);
        return;
      }

      // 2️⃣ Get all purchased posts
      const postIds = list.documents.map((d) => d.postId);
      const postsData = await databases.listDocuments(
        Config.databaseId,
        Config.COLLECTION_POSTS,
        [Query.equal("$id", postIds)]
      );

      // 3️⃣ Combine purchase info + post data
      const merged = list.documents.map((purchase) => {
        const post = postsData.documents.find((p) => p.$id === purchase.postId);
        return { ...purchase, post };
      });

      setPurchases(merged);
    } catch (err) {
      console.error("Load purchases error:", err);
      alert("Error loading purchases: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div>
        <h3>My Purchases</h3>
        <p>You must log in to view your purchases.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>My Purchases</h3>
      {loading ? (
        <div>Loading...</div>
      ) : purchases.length === 0 ? (
        <div className="small">You haven’t purchased any profiles yet.</div>
      ) : (
        <div className="posts">
          {purchases.map((p) => (
            <div key={p.$id} className="card">
              {p.post?.imageFileId ? (
                <img
                  src={`${Config.endpoint}/storage/files/${p.post.imageFileId}/view?project=${Config.projectId}`}
                  alt={p.post?.displayName}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/300x200?text=No+Photo"
                  alt="No photo"
                />
              )}
              <div>
                <strong>{p.post?.displayName}</strong>
                <p className="small">
                  {p.post?.location} • {p.post?.age} years
                </p>
                <p className="small">{p.post?.bio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
