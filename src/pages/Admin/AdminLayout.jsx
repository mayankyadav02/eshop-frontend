// src/pages/Admin/AdminLayout.jsx
import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice.js";
import "../../style/Admin/adminLayout.css";

const menuItems = [
  { text: "Dashboard", path: "/admin/dashboard" },
  { text: "Products", path: "/admin/products" },
  { text: "Orders", path: "/admin/orders" },
  { text: "Users", path: "/admin/users" },
  { text: "Reports", path: "/admin/reports" },
  { text: "Categories", path: "/admin/categories" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAdmin } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const switchToUserView = () => {
    navigate("/");
  };

  return (
    <div className={`admin-layout ${theme}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              to={item.path}
              className={`sidebar-link ${
                window.location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.text}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Navbar */}
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            {isAdmin && (
              <button className="switch-view" onClick={switchToUserView}>
                Switch to User View
              </button>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
