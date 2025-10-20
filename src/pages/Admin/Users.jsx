import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Box,
} from "@mui/material";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ThemeContext } from "../../context/ThemeContext"; // ✅ ThemeContext import
import "../../style/Admin/users.css"; 

export default function AdminUsers() {
  const { token } = useAuth();
  const { theme } = useContext(ThemeContext); // ✅ get current theme
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // Block / Unblock handler
  const toggleBlock = async (id, blocked) => {
    try {
      await axios.put(
        `/api/admin/users/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: !blocked } : u))
      );
    } catch (err) {
      console.error("Block/Unblock error:", err);
      setError("Failed to update user status");
    }
  };

  if (loading)
    return (
      <Box className={`admin-users-page ${theme}`}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box className={`admin-users-page ${theme}`}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <div className={`admin-users-page ${theme}`}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom className="page-title">
            Users Management
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} className="user-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role === "admin" ? "✅" : "❌"}</TableCell>
                    <TableCell>
                      {user.isBlocked ? "Blocked 🚫" : "Active ✅"}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={user.isBlocked ? "Unblock" : "Block"}>
                        <IconButton
                          color={user.isBlocked ? "success" : "error"}
                          onClick={() => toggleBlock(user._id, user.isBlocked)}
                        >
                          {user.isBlocked ? <CheckCircleIcon /> : <BlockIcon />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}