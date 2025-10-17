// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.js"; 
import { Box, Grid, Card, CardContent, Typography, TextField, Button, Divider } from "@mui/material";
import { clearCart, fetchCart } from "../redux/slices/cartSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const cartItems = Array.isArray(items) ? items : items?.cartItems || [];
  const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const [userDetails, setUserDetails] = useState({ name: "", email: "", phone: "", address: "" });
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  const handleCardChange = (e) => setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });

const handlePayment = async () => {
  if (!userDetails.name || !userDetails.address || !userDetails.phone) {
    alert("Please fill all shipping details!");
    return;
  }
  if (cardDetails.number.length < 12 || !cardDetails.expiry.includes("/") || cardDetails.cvc.length < 3) {
    alert("Enter valid dummy card details!");
    return;
  }

  setLoading(true);
  try {
    alert("Payment Successful! Placing order ✅");

    const orderData = {
      shippingAddress: {
        name: userDetails.name,
        address: userDetails.address,
        phone: userDetails.phone,
      },
      paymentMethod: "Card (Dummy)",
    };

    const { data } = await axios.post("/api/orders", orderData);
    console.log("Order created:", data);
    navigate(`/orders/${data._id}`);

    await dispatch(clearCart());
    dispatch(fetchCart());
    navigate("/orders");
  } catch (err) {
    console.error("Order Error:", err.response?.data || err.message);
    alert("Failed to place order!");
  } finally {
    setLoading(false);
  }
};


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Grid container spacing={3}>

        {/* Cart Summary */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Cart Summary</Typography>
          {cartItems.map((item) => (
            <Card key={item._id} sx={{ mb: 2 }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <img src={item.product.images?.[0] || "/placeholder.png"} alt={item.product.name} style={{ width: 80, height: 80, objectFit: "cover", marginRight: 16 }} />
                <Box>
                  <Typography variant="subtitle1">{item.product.name}</Typography>
                  <Typography variant="body2">₹{item.product.price} × {item.quantity} = ₹{item.product.price * item.quantity}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Total: ₹{totalPrice}</Typography>
        </Grid>

        {/* Shipping + Dummy Card */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Shipping & Payment</Typography>
          <TextField label="Name" name="name" fullWidth margin="normal" value={userDetails.name} onChange={handleChange} />
          <TextField label="Email" name="email" fullWidth margin="normal" value={userDetails.email} onChange={handleChange} />
          <TextField label="Phone" name="phone" fullWidth margin="normal" value={userDetails.phone} onChange={handleChange} />
          <TextField label="Address" name="address" fullWidth margin="normal" multiline rows={4} value={userDetails.address} onChange={handleChange} />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>Dummy Card Details</Typography>
          <TextField label="Card Number" name="number" fullWidth margin="normal" value={cardDetails.number} onChange={handleCardChange} placeholder="123412341234" />
          <TextField label="Expiry (MM/YY)" name="expiry" fullWidth margin="normal" value={cardDetails.expiry} onChange={handleCardChange} placeholder="12/34" />
          <TextField label="CVC" name="cvc" fullWidth margin="normal" value={cardDetails.cvc} onChange={handleCardChange} placeholder="123" />

          <Button variant="contained" color="primary" sx={{ mt: 3 }} fullWidth disabled={loading} onClick={handlePayment}>
            {loading ? "Processing..." : `Pay ₹${totalPrice}`}
          </Button>
        </Grid>

      </Grid>
    </Box>
  );
}
