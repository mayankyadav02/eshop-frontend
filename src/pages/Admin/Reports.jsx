import React, { useEffect, useState, useContext } from "react";
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
import { ThemeContext } from "../../context/ThemeContext";

import "../../style/Admin/report.css";

export default function AdminReports() {
  const { token } = useAuth();
  const { theme } = useContext(ThemeContext);

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
    <div className={`admin-reports-page ${theme}`}>
      <Typography variant="h5" gutterBottom className="page-title">
        Admin Reports
      </Typography>

      {/* 🗂 Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card className="report-card">
            <CardContent>
              <Typography className="card-title">Total Categories</Typography>
              <Typography variant="h6">{salesByCategory.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="report-card">
            <CardContent>
              <Typography className="card-title">Total Orders</Typography>
              <Typography variant="h6">
                {orderStatusCounts.reduce((acc, o) => acc + o.count, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="report-card">
            <CardContent>
              <Typography className="card-title">Pending Orders</Typography>
              <Typography variant="h6">
                {orderStatusCounts.find((o) => o.status === "Pending")?.count || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 📝 Sales by Category Table */}
      <Typography variant="h6" className="table-title">
        Sales by Category
      </Typography>
      <TableContainer component={Paper} className="report-table">
        <Table>
          <TableHead>
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
      <Typography variant="h6" className="table-title">
        Top Products
      </Typography>
      <TableContainer component={Paper} className="report-table">
        <Table>
          <TableHead>
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
    </div>
  );
}
