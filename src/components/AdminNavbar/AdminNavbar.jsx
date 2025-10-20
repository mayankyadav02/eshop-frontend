// src/components/AdminNavbar/AdminNavbar.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header
      className={`admin-navbar ${theme === "dark" ? "dark-mode" : "light-mode"}`}
    >
      <h1 className="admin-title">Admin Dashboard</h1>
      <div className="admin-actions">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
};

export default AdminNavbar;
