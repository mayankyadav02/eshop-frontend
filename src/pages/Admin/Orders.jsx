import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  MenuItem,
  TextField,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { ThemeContext } from "../../context/ThemeContext";
import "../../style/Admin/order.css";

export default function AdminOrders() {
  const { token } = useAuth();
  const { theme } = useContext(ThemeContext);

  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ✅ Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("Orders fetch error:", err);
    }
  };

  // ✅ Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("/api/admin/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data || {});
    } catch (err) {
      console.error("Analytics fetch error:", err);
    }
  };

  // ✅ Update order status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `/api/admin/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // ✅ Deliver order
  const handleDeliver = async (id) => {
    try {
      await axios.put(
        `/api/admin/orders/${id}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Deliver error:", err);
    }
  };

  // ✅ Approve return
  const handleApproveReturn = async (id) => {
    try {
      await axios.put(
        `/api/admin/orders/${id}/approve-return`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Return approval error:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchAnalytics();
    }
  }, [token]);

  return (
    <Box className={`admin-orders-page ${theme}`}>
      <Typography variant="h5" className="page-title">
        Admin Orders
      </Typography>

      {/* 📊 Analytics Summary */}
      <Grid container spacing={2}>
        {[
          { label: "Total Orders", value: analytics.totalOrders || 0 },
          { label: "Pending Orders", value: analytics.pendingOrders || 0 },
          { label: "Delivered Orders", value: analytics.deliveredOrders || 0 },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className={`analytics-card ${theme}`}>
              <CardContent>
                <Typography>{item.label}</Typography>
                <Typography variant="h6">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 📋 Orders Table */}
      <TableContainer component={Paper} className="admin-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((o) => (
              <TableRow key={o._id}>
                <TableCell>{o._id}</TableCell>
                <TableCell>{o.user?.email}</TableCell>
                <TableCell>₹{o.totalPrice}</TableCell>
                <TableCell>
                  <TextField
                    select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    size="small"
                    className="status-select"
                  >
                    {["Pending", "Processing", "Shipped", "Delivered"].map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button onClick={() => setSelectedOrder(o)}>View</Button>
                  <Button color="success" onClick={() => handleDeliver(o._id)}>
                    Deliver
                  </Button>
                  <Button color="error" onClick={() => handleApproveReturn(o._id)}>
                    Approve Return
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {/* 🔎 Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        fullWidth
        maxWidth="md"
        className={`order-dialog ${theme}`}
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography>User: {selectedOrder.user?.email}</Typography>
              <Typography>Status: {selectedOrder.orderStatus}</Typography>
              <Typography sx={{ mt: 2 }}>Items:</Typography>
              {selectedOrder.orderItems?.map((item) => (
                <Typography key={item._id}>
                  {item.product?.name} - {item.qty} × ₹{item.price}
                </Typography>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrder(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
