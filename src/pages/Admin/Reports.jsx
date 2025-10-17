import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

export default function AdminReports() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchReports = async () => {
      try {
        const [catRes, statusRes, topRes] = await Promise.all([
          axios.get("/api/admin/reports/sales-by-category", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/reports/order-status-counts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/reports/top-products?limit=10", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSalesByCategory(catRes.data);
        setOrderStatusCounts(statusRes.data);
        setTopProducts(topRes.data);
      } catch (err) {
        console.error("Reports fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Admin Reports
      </Typography>

      {/* 🗂 Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography>Total Categories</Typography>
              <Typography variant="h6">{salesByCategory.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography>Total Orders</Typography>
              <Typography variant="h6">
                {orderStatusCounts.reduce((acc, o) => acc + o.count, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography>Pending Orders</Typography>
              <Typography variant="h6">
                {orderStatusCounts.find((o) => o.status === "Pending")?.count || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 📝 Sales by Category Table */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Sales by Category
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ background: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Total Sales</TableCell>
              <TableCell>Total Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesByCategory.map((c) => (
              <TableRow key={c.categoryId}>
                <TableCell>{c.categoryName}</TableCell>
                <TableCell>₹{c.totalSales}</TableCell>
                <TableCell>{c.totalQty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📝 Top Products Table */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Top Products
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Quantity Sold</TableCell>
              <TableCell>Total Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topProducts.map((p) => (
              <TableRow key={p.productId}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>{p.totalQty}</TableCell>
                <TableCell>₹{p.totalRevenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
