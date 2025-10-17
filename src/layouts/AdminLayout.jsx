import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Button } from "@mui/material";

const drawerWidth = 220;

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1e293b",
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/admin/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/admin/products">
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button component={Link} to="/admin/orders">
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button component={Link} to="/admin/users">
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button component={Link} to="/admin/reports">
            <ListItemText primary="Reports" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f1f5f9", p: 3 }}>
        {/* Topbar */}
        <AppBar position="fixed" sx={{ ml: `${drawerWidth}px`, width: `calc(100% - ${drawerWidth}px)` }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Admin Panel</Typography>
            <Button color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* spacing for AppBar */}
        
        {/* Render selected page */}
        <Outlet />
      </Box>
    </Box>
  );
}
