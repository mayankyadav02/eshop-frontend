import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, clearCart } from "../redux/slices/cartSlice";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const cartItems = Array.isArray(items) ? items : items?.cartItems || [];

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  if (error)
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  if (!cartItems || cartItems.length === 0)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        Your cart is empty 🛒
      </Typography>
    );

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      <Grid container spacing={3}>
        {cartItems.map((item) => {
          let imgUrl = "";
          try {
            const parsed = JSON.parse(item.product.images[0]);
            imgUrl = parsed[0];
          } catch (err) {
            imgUrl = item.product.images?.[0] || "";
          }

          return (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={imgUrl || "/placeholder.png"}
                  alt={item.product.name}
                  sx={{ objectFit: "cover" }}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <CardContent>
                  <Typography variant="h6">{item.product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ₹{item.product.price} × {item.quantity}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Subtotal: ₹{item.product.price * item.quantity}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={async () => {
                      await dispatch(removeFromCart({ productId: item.product._id }));
                      dispatch(fetchCart());
                    }}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Cart Summary */}
      <Box sx={{ mt: 4, textAlign: "right" }}>
        <Typography variant="h6">Total: ₹{totalPrice}</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          onClick={async () => {
            await dispatch(clearCart());
            dispatch(fetchCart());
          }}
        >
          Clear Cart
        </Button>
      </Box>
    </Box>
  );
}
