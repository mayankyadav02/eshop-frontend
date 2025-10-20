// src/components/AdminSidebar/AdminSidebar.jsx
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const { theme } = useContext(ThemeContext);

  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/reports", label: "Reports" },
  ];

  return (
    <aside
      className={`admin-sidebar ${theme === "dark" ? "dark-mode" : "light-mode"}`}
    >
      <h2 className="sidebar-title">Admin Panel</h2>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${
              pathname === link.to ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
