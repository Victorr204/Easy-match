import React, { useState } from "react";
import { databases, storage, ID, Config } from "../services/appwrite";
import { startPaystackTransaction, verifyPaymentOnServer } from "../services/paystack";

export default function CreatePostForm({ user, onClose, refreshPosts }) {
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("genders");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  async function doCreatePost() {
    if (!displayName || !age || !location || !photo) {
      alert("Please fill all required fields and upload a photo.");
      return;
    }
    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }

    try {
      setLoading(true);

      // 🧮 Step 1: Calculate total with 1.2% charge
      const baseAmount = 700; // ₦700 post creation fee
      const charge = baseAmount * 0.012; // 1.2% processing fee
      const totalAmount = Math.round(baseAmount + charge); // ₦708

      // 🟢 Step 2: Start Paystack payment from frontend
      const reference = await startPaystackTransaction(
        totalAmount,
        "EasyMatch Profile Post Fee",
        { displayName, userId: user.$id },
        user.email
      );

      if (!reference) {
        alert("Payment was cancelled or not completed.");
        setLoading(false);
        return;
      }

      // 🟢 Step 3: Verify payment on backend
      const verifyData = await verifyPaymentOnServer(reference, totalAmount);
      if (!verifyData.verified) {
        throw new Error("Payment could not be verified. Please try again.");
      }

      // ✅ Step 4: Upload image to Appwrite storage
      const uploaded = await storage.createFile(
        Config.photoBucketId,
        ID.unique(),
        photo
      );

      // ✅ Step 5: Create post document in Appwrite
      await databases.createDocument(
        Config.databaseId,
        Config.COLLECTION_POSTS,
        ID.unique(),
        {
          ownerId: user.$id,
          displayName,
          age: parseFloat(age),
          gender,
          location,
          bio,
          phone,
          whatsapp,
          instagram,
          imageFileId: uploaded.$id,
          paymentVerified: true,
          amountPaid: baseAmount,
          totalPaid: totalAmount,
          chargeFee: charge,
        }
      );

      alert(`🎉 Post created successfully! You were charged ₦${totalAmount.toLocaleString()}.`);
      refreshPosts && refreshPosts();
      onClose && onClose();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Error creating post: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Create Post</h3>
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
          placeholder="City or Location (state, country)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="form-row">
        <textarea
          placeholder="Short bio (about yourself, what you're looking for..., and your interests)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
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
        <label>Upload Photo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </div>
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <button onClick={doCreatePost} disabled={loading}>
          {loading ? "Processing..." : "Create Post (₦708)"}
        </button>
      </div>
      <p style={{ fontSize: "0.85em", opacity: 0.8, textAlign: "right" }}>
        ₦700 
      </p>
    </div>
  );
}
