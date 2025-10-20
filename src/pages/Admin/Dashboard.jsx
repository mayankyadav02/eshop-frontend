import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import "../../style/Admin/dashboard.css"

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const [summaryRes, revenueRes, categoryRes, productsRes, ordersRes] = await Promise.all([
          axios.get("/api/admin/summary", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/admin/monthly-revenue", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/admin/reports/sales-by-category", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/admin/reports/top-products?limit=5", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/admin/recent-orders?limit=5", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setStats(summaryRes.data);
        setMonthlyRevenue(revenueRes.data);
        setSalesByCategory(categoryRes.data);
        setTopProducts(productsRes.data);
        setRecentOrders(ordersRes.data.orders || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading)
    return <div className={`dashboard-loading ${theme}`}><CircularProgress /></div>;

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  return (
<div className={`dashboard-page ${theme}`}>
  <Grid container spacing={3}>

    {/* Summary Cards */}
    {[
      { label: "Users", value: stats?.totalUsers },
      { label: "Orders", value: stats?.totalOrders },
      { label: "Revenue", value: `₹${stats?.totalRevenue}` },
      { label: "Pending Orders", value: stats?.pendingOrders },
      { label: "Delivered Orders", value: stats?.deliveredOrders },
    ].map((item, i) => (
      <Grid key={i} item xs={12} sm={6} md={2.4}>
        <Card className="dashboard-card">
          <CardContent>
            <Typography variant="h6">{item.label}</Typography>
            <Typography variant="h4">{item.value}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}

    {/* Charts Section */}
    <Grid item xs={12} md={6}>
      <Card className="dashboard-card">
        <CardContent>
          <Typography variant="h6">Monthly Revenue</Typography>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={6}>
      <Card className="dashboard-card">
        <CardContent>
          <Typography variant="h6">Sales by Category</Typography>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  dataKey="totalSales"
                  nameKey="categoryName"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {salesByCategory.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </Grid>

    {/* Tables Section */}
    <Grid item xs={12} md={6}>
      <Card className="dashboard-card">
        <CardContent>
          <Typography variant="h6">Top Products</Typography>
          <TableContainer component={Paper} className="dashboard-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity Sold</TableCell>
                  <TableCell>Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topProducts.map((p) => (
                  <TableRow key={p.productId}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.totalQty}</TableCell>
                    <TableCell>₹{p.totalRevenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={6}>
      <Card className="dashboard-card">
        <CardContent>
          <Typography variant="h6">Recent Orders</Typography>
          <TableContainer component={Paper} className="dashboard-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((o) => (
                  <TableRow key={o._id}>
                    <TableCell>{o._id}</TableCell>
                    <TableCell>{o.user?.name}</TableCell>
                    <TableCell>{o.status}</TableCell>
                    <TableCell>₹{o.totalPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>

  </Grid>
</div>
  );
}
