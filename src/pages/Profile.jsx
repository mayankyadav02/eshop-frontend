// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../api/axios.js"; // apna axios instance
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { updateProfile } from "../redux/slices/authSlice.js"; // optional: redux me auth update

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
    // ensure state updates if userInfo changes
    setName(userInfo?.name || "");
    setEmail(userInfo?.email || "");
  }, [userInfo]);

  if (!userInfo) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">User not found ❌</Typography>
      </Box>
    );
  }

  const handleUpdate = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // ✅ call backend route correctly
      const { data } = await axios.put("/api/users/profile", { name, email });
      setSuccessMsg("Profile updated successfully ✅");
      setEditMode(false);

      // Optional: update redux auth state
      dispatch(updateProfile(data));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500 }}>
      <Typography variant="h4" gutterBottom>
        {userInfo.name}'s Profile
      </Typography>

      {!editMode ? (
        <>
          <Typography variant="body1"><strong>Email:</strong> {userInfo.email}</Typography>
          <Typography variant="body1"><strong>Role:</strong> {userInfo.role}</Typography>
          <Typography variant="body1"><strong>User ID:</strong> {userInfo._id}</Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setEditMode(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          {successMsg && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              {successMsg}
            </Typography>
          )}
          {errorMsg && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMsg}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
