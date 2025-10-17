// src/pages/Orders.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/orderSlice.js";
import { Box, Typography, Card, CardContent, Button, CircularProgress, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <CircularProgress sx={{ display: "block", m: 3 }} />;

  if (!list.length)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        No orders found ❌
      </Typography>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {list.map((order) => (
        <Card key={order._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Order #{order._id}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total: ₹{order.totalPrice} | Status:{" "}
              <strong>{order.orderStatus}</strong>
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Typography variant="body2">
              {order.items.length} items | Payment: {order.paymentMethod}
            </Typography>

            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              View Details →
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
