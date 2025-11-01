// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { account, databases, ID, Config } from "../services/appwrite";
import "../styles/easy.css";

import Modal from "../components/Modal";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import PostDetails from "../components/PostDetails";
import CreatePostForm from "../components/CreatePostForm";
import EditPostForm from "../components/EditPostForm";
import MyPurchases from "../components/MyPurchases";

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [myPost, setMyPost] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const showModal = (content) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  useEffect(() => {
    refreshAuth();
  }, []);

  async function refreshAuth() {
    try {
      const current = await account.get();
      setUser(current);
      loadPosts(current);
    } catch (err) {
      console.warn("⚠️ No active session:", err.message);
      setUser(null);
      loadPosts(null);
    }
  }

  async function loadPosts(currentUser = user) {
    try {
      const list = await databases.listDocuments(
        Config.databaseId,
        Config.COLLECTION_POSTS
      );

      setPosts(list.documents);

      // If logged in, find user's post
      if (currentUser) {
        const mine = list.documents.find(
          (p) => p.ownerId === currentUser.$id
        );
        setMyPost(mine || null);
      } else {
        setMyPost(null);
      }
    } catch (err) {
      console.error("Load posts error:", err);
    }
  }

  async function handleLogout() {
    await account.deleteSession("current");
    setUser(null);
    setMyPost(null);
  }

  const openRegister = () =>
    showModal(<RegisterForm onClose={closeModal} refreshAuth={refreshAuth} />);
  const openLogin = () =>
    showModal(<LoginForm onClose={closeModal} refreshAuth={refreshAuth} />);

  return (
    <div className="container">
      <header>
        <div className="brand">
          <div className="logo">EM</div>
          <div>
            <div style={{ fontWeight: 700 }}>EasyMatch</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              Connect safely • Respectfully • Easily
            </div>
          </div>
        </div>

        <div id="authArea">
          {!user ? (
            <>
              <button onClick={openRegister}>Register</button>
              <button style={{ marginLeft: 8 }} onClick={openLogin}>
                Login
              </button>
            </>
          ) : (
            <button
              id="btnLogout"
              style={{ marginLeft: 8 }}
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <main>
        <div className="grid">
          <div>
           <div className="card">
  <h3>Public Profiles</h3>
  <div className="small">
    Browse profiles — names and images are blurred until you pay to unlock a profile.
  </div>

  <div
    id="postsList"
    className="posts-vertical"
    style={{
      marginTop: 12,
      maxHeight: "70vh",        // make it scrollable within viewport
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      paddingRight: "4px",
    }}
  >
    {posts.length === 0 ? (
      <div className="small">No profiles found.</div>
    ) : (
      posts.map((post) => (
        <div
          key={post.$id}
          className="post card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "12px",
            borderRadius: "12px",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)", // darker shadow
          }}
        >
          <img
            src={
              post.imageFileId
                ? `${Config.endpoint}/storage/buckets/${Config.photoBucketId}/files/${post.imageFileId}/view?project=${Config.projectId}`
                : "https://via.placeholder.com/300x200?text=No+Photo"
            }
            alt={post.displayName}
            style={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
              borderRadius: "12px",
              marginBottom: "8px",
            }}
          />

          <div style={{ fontWeight: 600, fontSize: "1rem" }}>
            {post.displayName || "Anonymous"}
          </div>
          <div className="small" style={{ marginTop: 4 }}>
            {post.location || "Unknown"} • {post.age || ""}
          </div>

          <button
            className="view-btn"
            style={{ marginTop: 8 }}
            onClick={() =>
              showModal(<PostDetails post={post} user={user} />)
            }
          >
            View Details (₦1,000)
          </button>
        </div>
      ))
    )}
  </div>
</div>

          </div>

          <aside>
            <div className="card">
              <h4>Your Account</h4>
              <div id="accountInfo" className="small">
                {user ? user.name : "Not logged in"}
              </div>

              {user && (
                <div style={{ marginTop: 12 }}>
                  {!myPost ? (
                    <button
                      id="btnOpenCreatePost"
                      onClick={() =>
                        showModal(
                          <CreatePostForm
                            user={user}
                            onClose={closeModal}
                            refreshPosts={loadPosts}
                          />
                        )
                      }
                    >
                      Create Post (One post per user)
                    </button>
                  ) : (
                    <button
                      id="btnEditPost"
                      onClick={() =>
                        showModal(
                          <EditPostForm
                            post={myPost}
                            onClose={closeModal}
                            refreshPosts={loadPosts}
                          />
                        )
                      }
                    >
                      Edit My Post
                    </button>
                  )}

                  <button
                    id="btnMyPurchases"
                    style={{ marginTop: 8 }}
                    onClick={() =>
                      showModal(
                        <MyPurchases user={user} onClose={closeModal} />
                      )
                    }
                  >
                    My Purchases
                  </button>
                </div>
              )}
            </div>

            <div className="card">
              <h4>How it works</h4>
              <ol className="small">
                <li>Register (must be 18+)</li>
                <li>
                  Upload profile. Females pay ₦500 to post; males pay ₦700 to
                  post
                </li>
                <li>
                  Browse public posts. Click 'View' to pay ₦1,000 to unlock full
                  contact info
                </li>
                <li>
                  Each unlocked profile purchase is permanent for your account
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </main>

      <footer>EasyMatch • Built with care. Follow community rules.</footer>

      <Modal show={!!modalContent} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Home;