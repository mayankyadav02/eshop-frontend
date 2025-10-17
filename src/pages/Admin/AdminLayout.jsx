// src/pages/Admin/AdminLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemText, ListItemButton, AppBar, Toolbar, Typography, Button } from "@mui/material";
import useAuth from "../../hooks/useAuth"; // 👈 auth hook import
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice.js"; // ✅ redux logout action import

const menuItems = [
  { text: "Dashboard", path: "/admin/dashboard" },
  { text: "Products", path: "/admin/products" },
  { text: "Orders", path: "/admin/orders" },
  { text: "Users", path: "/admin/users" },
    { text: "Reports", path: "/admin/reports" },
  { text: "Categories", path: "/admin/categories" }
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth(); // 👈 hook se admin info
  const dispatch = useDispatch();
  // const handleLogout = () => {
  //   localStorage.removeItem("userInfo"); // token + userInfo remove
  //   navigate("/login");
  // };
  const handleLogout = () => {
    dispatch(logout()); // redux state clear
    navigate("/login"); // redirect to login
  };

  const switchToUserView = () => {
    navigate("/"); // 👈 user home page
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 220,
          [`& .MuiDrawer-paper`]: { width: 220, boxSizing: "border-box", backgroundColor: "#222", color: "#fff" },
        }}
      >
        <Toolbar>
          <Typography variant="h6">Admin Panel</Typography>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} component={Link} to={item.path} disablePadding>
                <ListItemButton>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "220px" }}>
        {/* Header */}
        <AppBar position="static" sx={{ backgroundColor: "#1976d2", mb: 3 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Admin Dashboard</Typography>
            <Box>
              {/* Switch button sirf admin ke liye */}
              {isAdmin && (
                <Button color="inherit" onClick={switchToUserView} sx={{ mr: 2 }}>
                  Switch to User View
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Nested Routes */}
        <Outlet />
      </Box>
    </Box>
  );
}
