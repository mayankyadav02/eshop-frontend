import React, { useEffect, useState } from "react";
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

export default function AdminDashboard() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch Orders
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

  // Fetch Analytics
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

  // Update Order Status
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
    <Box>
      <Typography variant="h5" gutterBottom>
        Order Dashboard
      </Typography>

      {/* 📊 Analytics Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography>Total Orders</Typography>
              <Typography variant="h6">{analytics.totalOrders || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography>Pending Orders</Typography>
              <Typography variant="h6">{analytics.pendingOrders || 0}</Typography>
            </CardContent>
          </Card>
              </Grid>
                      <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography>Delivered Orders</Typography>
              <Typography variant="h6">{analytics.deliveredOrders || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

          </Grid>

      {/* 📋 Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f0f0f0" }}>
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
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((o) => (
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
                      style={{ width: "120px" }}
                    >
                      {["Pending", "Processing", "Shipped", "Delivered"].map(
                        (status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => setSelectedOrder(o)}>
                      View
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDeliver(o._id)}
                      color="success"
                    >
                      Deliver
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleApproveReturn(o._id)}
                      color="error"
                    >
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

      {/* 🔎 Order Details Modal */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        fullWidth
        maxWidth="md"
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
