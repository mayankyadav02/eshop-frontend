// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../api/axios.js";
import { updateProfile } from "../redux/slices/authSlice.js";
import "../style/profilePage.css"; // ✅ external css added

export default function Profile() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setName(userInfo?.name || "");
    setEmail(userInfo?.email || "");
  }, [userInfo]);

  if (!userInfo) {
    return (
      <div className="profile-container">
        <p className="error-text">User not found ❌</p>
      </div>
    );
  }

  const handleUpdate = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const { data } = await axios.put("/api/users/profile", { name, email });
      setSuccessMsg("Profile updated successfully ✅");
      setEditMode(false);
      dispatch(updateProfile(data));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">{userInfo.name}'s Profile</h2>

      {!editMode ? (
        <>
          <p className="profile-info"><strong>Email:</strong> {userInfo.email}</p>
          <p className="profile-info"><strong>Role:</strong> {userInfo.role}</p>
          <p className="profile-info"><strong>User ID:</strong> {userInfo._id}</p>

          <button className="btn-primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        </>
      ) : (
        <>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="button-group">
            <button
              className="btn-primary"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setEditMode(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          {successMsg && <p className="success-text">{successMsg}</p>}
          {errorMsg && <p className="error-text">{errorMsg}</p>}
        </>
      )}
    </div>
  );
}
