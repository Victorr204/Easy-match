import React, { useState } from "react";
import { databases, storage, ID, Config } from "../services/appwrite";

export default function EditPostForm({ post, onClose, refreshPosts }) {
  const [displayName, setDisplayName] = useState(post.displayName || "");
  const [age, setAge] = useState(post.age || "");
  const [gender, setGender] = useState(post.gender || "genders");
  const [location, setLocation] = useState(post.location || "");
  const [bio, setBio] = useState(post.bio || "");
  const [phone, setPhone] = useState(post.phone || "");
  const [whatsapp, setWhatsapp] = useState(post.whatsapp || "");
  const [instagram, setInstagram] = useState(post.instagram || "");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Update post
  async function doUpdatePost() {
    try {
      setLoading(true);
      let imageFileId = post.imageFileId;

      // If a new photo was uploaded, replace the old one
      if (photo) {
        try {
          await storage.deleteFile(Config.photoBucketId, post.imageFileId);
        } catch (err) {
          console.warn("Old photo not found:", err.message);
        }

        const uploaded = await storage.createFile(
          Config.photoBucketId,
          ID.unique(),
          photo
        );
        imageFileId = uploaded.$id;
      }

      await databases.updateDocument(
        Config.databaseId,
        Config.COLLECTION_POSTS,
        post.$id,
        {
          displayName,
          age: parseFloat(age),
          gender,
          location,
          bio,
          phone,
          whatsapp,
          instagram,
          imageFileId,
        }
      );

      alert("Post updated successfully!");
      refreshPosts && refreshPosts();
      onClose && onClose();
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Error updating post: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Delete post
  async function doDeletePost() {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setLoading(true);

      try {
        await storage.deleteFile(Config.photoBucketId, post.imageFileId);
      } catch (err) {
        console.warn("Could not delete photo:", err.message);
      }

      await databases.deleteDocument(
        Config.databaseId,
        Config.COLLECTION_POSTS,
        post.$id
      );

      alert("Post deleted successfully!");
      refreshPosts && refreshPosts();
      onClose && onClose();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error deleting post: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Edit Post</h3>

      <div className="form-row">
        <input
          placeholder="Your display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div className="form-row">
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <div className="form-row">
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="genders">Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-row">
        <input
          placeholder="City or Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="form-row">
        <textarea
          placeholder="Short bio (about yourself, what you're looking for..., and your interests to get from the match)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      {/* ✅ Editable Contact Info Section */}
      <div className="form-row">
        <input
          placeholder="Phone number (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="form-row">
        <input
          placeholder="WhatsApp number (optional)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </div>

      <div className="form-row">
        <input
          placeholder="Instagram username (optional)"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Change Photo (optional):</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </div>

      <div style={{ textAlign: "right", marginTop: 10 }}>
        <button onClick={doUpdatePost} disabled={loading}>
          {loading ? "Updating..." : "Update Post"}
        </button>
        <button
          onClick={doDeletePost}
          style={{ marginLeft: 10, color: "red" }}
          disabled={loading}
        >
          Delete Post
        </button>
      </div>
    </div>
  );
}
