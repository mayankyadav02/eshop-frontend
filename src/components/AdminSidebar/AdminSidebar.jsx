import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/reports", label: "Reports" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block p-2 rounded-md ${
              pathname === link.to ? "bg-blue-500 text-white" : "hover:bg-gray-200"
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
