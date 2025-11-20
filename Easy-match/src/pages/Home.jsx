// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { account, databases, ID, Config } from "../services/appwrite";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import "../styles/easy.css";

import Modal from "../components/Modal";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import PostDetails from "../components/PostDetails";
import CreatePostForm from "../components/CreatePostForm";
import EditPostForm from "../components/EditPostForm";
import MyPurchases from "../components/MyPurchases";
import logo from "../assets/logo.png";
import Footer from "../components/Footer";
import TermsPage from "./TermsPage";
import PrivacyPage from "./PrivacyPage";
import CookiesPage from "./CookiesPage";

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [myPost, setMyPost] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <Router>
      <div className="container">
        <header>
          <div className="brand">
            <div className="logo">
              <img src={logo} alt="logo" width={48} height={48} />
            </div>
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

          {/* Hamburger for small screens */}
          <button
            className="hamburger"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>

          {mobileOpen && (
            <div className="mobile-nav">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      openRegister();
                      setMobileOpen(false);
                    }}
                  >
                    Register
                  </button>
                  <button
                    onClick={() => {
                      openLogin();
                      setMobileOpen(false);
                    }}
                  >
                    Login
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </header>

        <main>
          <Routes>
            {/* 🏠 Home content */}
            <Route
              path="/"
              element={
                <div className="grid">
                  <div>
                    <div className="card">
                      <h3>Public Profiles</h3>
                      <div className="small">
                        Browse profiles — contact info is locked until you pay to
                        unlock.
                      </div>

                      <div
                        id="postsList"
                        className="posts-vertical"
                        style={{
                          marginTop: 12,
                          maxHeight: "70vh",
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
                                boxShadow:
                                  "0 6px 16px rgba(0, 0, 0, 0.25)",
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
                                  height: "400px",
                                  objectFit: "cover",
                                  borderRadius: "12px",
                                  marginBottom: "8px",
                                }}
                              />

                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: "1rem",
                                }}
                              >
                                {post.displayName || "Anonymous"}
                              </div>
                              <div
                                className="small"
                                style={{ marginTop: 4 }}
                              >
                                {post.location || "Unknown"} •{" "}
                                {post.age || ""}
                              </div>

                              <button
                                className="view-btn"
                                style={{ marginTop: 8 }}
                                onClick={() =>
                                  showModal(
                                    <PostDetails post={post} user={user} />
                                  )
                                }
                              >
                                View Details (₦500)
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
                              Create Post
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
                        <li>Upload profile (₦500 fee)</li>
                        <li>
                          Browse posts. Pay ₦500 to unlock contact info.
                        </li>
                        <li>Unlocked profiles stay accessible forever.</li>
                      </ol>
                    </div>
                  </aside>
                </div>
              }
            />

            {/* 📄 Footer pages */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
          </Routes>
        </main>

        {/* 🌍 Footer Links */}
        <footer style={{ textAlign: "center", padding: "20px 0" }}>
          <p>EasyMatch • Built with care. Follow community rules.</p>
          <p>© 2025 EasyMatch. All rights reserved.</p>
          <nav style={{ marginTop: 8 }}>
            <Link to="/terms" style={{ margin: "0 10px" }}>
              Terms of Use
            </Link>
            <Link to="/privacy" style={{ margin: "0 10px" }}>
              Privacy Policy
            </Link>
            <Link to="/cookies" style={{ margin: "0 10px" }}>
              Cookies
            </Link>
          </nav>
        </footer>

        <Modal show={!!modalContent} onClose={closeModal}>
          {modalContent}
        </Modal>
      </div>
    </Router>
  );
};

export default Home;