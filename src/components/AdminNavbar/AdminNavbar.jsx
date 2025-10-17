const AdminNavbar = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      <button className="px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>
    </header>
  );
};

export default AdminNavbar;
