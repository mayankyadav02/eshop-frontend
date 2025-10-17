// src/pages/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Divider,
  TextField,
} from "@mui/material";

export default function OrderDetails() {
  const { id } = useParams(); // order id from URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [returning, setReturning] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        console.log("Order Details:", data);
        setOrder(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch order details!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // Cancel order
  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? ❌")) return;

    try {
      setCanceling(true);
      const { data } = await axios.put(`/api/orders/${id}/cancel`);
      alert("Order cancelled successfully ✅");
      setOrder(data); // update UI with cancelled order
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order!");
    } finally {
      setCanceling(false);
    }
  };

  // Request return
  const handleReturnRequest = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for return.");
      return;
    }

    if (!window.confirm("Do you want to request a return for this order? 🔄")) return;

    try {
      setReturning(true);
      const { data } = await axios.put(`/api/orders/${id}/return`, { reason });
      alert("Return request submitted ✅");
      setOrder(data.order); // update with updated order info
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to request return!");
    } finally {
      setReturning(false);
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;

  if (!order)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        Order not found ❌
      </Typography>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate("/orders")}>
        ← Back to Orders
      </Button>

      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Order Details
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">Order ID: {order._id}</Typography>
          <Typography variant="body2" color="text.secondary">
            Total: ₹{order.totalPrice} | Payment:{" "}
            {order.paymentMethod || "Pending"} | Status:{" "}
            <strong>{order.orderStatus || "Processing"}</strong>
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">Shipping Details</Typography>
          <Typography variant="body2">
            {order.shippingAddress?.fullName}
          </Typography>
          <Typography variant="body2">
            {order.shippingAddress?.addressLine}
          </Typography>
          <Typography variant="body2">
            {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
            {order.shippingAddress?.zip}
          </Typography>
          <Typography variant="body2">
            {order.shippingAddress?.phone}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">Products</Typography>
          {order.items.map((item, idx) => (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", my: 1 }}
            >
              <img
                src={item.product?.image || "/placeholder.png"}
                alt={item.product?.name}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  marginRight: 10,
                }}
              />
              <Box>
                <Typography variant="body2">
                  {item.product?.name || "Product"}
                </Typography>
                <Typography variant="body2">
                  ₹{item.price} × {item.quantity}
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Cancel Button */}
          {order.orderStatus === "Processing" && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ mt: 2 }}
              disabled={canceling}
              onClick={handleCancelOrder}
            >
              {canceling ? "Cancelling..." : "Cancel Order"}
            </Button>
          )}

          {order.orderStatus === "Cancelled" && (
            <Typography color="error" sx={{ mt: 2 }}>
              This order is cancelled ❌
            </Typography>
          )}

          {/* Return Request Section */}
          {order.orderStatus === "Delivered" && !order.returnRequested && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Request a Return
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Enter reason for return"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <Button
                variant="outlined"
                color="warning"
                size="small"
                sx={{ mt: 2 }}
                disabled={returning}
                onClick={handleReturnRequest}
              >
                {returning ? "Submitting..." : "Request Return"}
              </Button>
            </Box>
          )}

          {order.returnRequested && (
            <Typography color="warning.main" sx={{ mt: 2 }}>
              ✅ Return requested for this order. Reason: {order.returnReason}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
