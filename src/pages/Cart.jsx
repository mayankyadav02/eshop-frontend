import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../style/cartPage.css";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const cartItems = Array.isArray(items) ? items : items?.cartItems || [];
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (loading) return <div className="cart-loading"><CircularProgress /></div>;
  if (error) return <Typography className="cart-error">{error}</Typography>;
  if (!cartItems || cartItems.length === 0)
    return <Typography className="cart-empty">Your cart is empty 🛒</Typography>;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Typography variant="h4">Your Cart</Typography>
        <Button className="cart-clear-btn" onClick={async () => { await dispatch(clearCart()); dispatch(fetchCart()); }}>
          Clear Cart
        </Button>
      </div>

      <Grid container spacing={3} className="cart-grid">
        {cartItems.map((item) => {
          let imgUrl = "";
          try {
            const parsed = JSON.parse(item.product.images[0]);
            imgUrl = parsed[0];
          } catch (err) {
            imgUrl = item.product.images?.[0] || "/placeholder.png";
          }

          return (
            <Grid item xs={12} sm={6} md={3} key={item._id}>
              <Card className="cart-card">
                <div className="cart-card-img" onClick={() => navigate(`/product/${item.product._id}`)}>
                  <CardMedia
                    component="img"
                    image={imgUrl}
                    alt={item.product.name}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                </div>
                <CardContent className="cart-card-content">
                  <Typography className="cart-product-name">{item.product.name}</Typography>
                  <Typography className="cart-product-price">
                    ₹{item.product.price} × {item.quantity}
                  </Typography>
                  <Typography className="cart-product-subtotal">
                    Subtotal: ₹{item.product.price * item.quantity}
                  </Typography>
                  <Button className="cart-remove-btn" onClick={async () => { await dispatch(removeFromCart({ productId: item.product._id })); dispatch(fetchCart()); }}>
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <div className="cart-summary">
        <Typography variant="h6">Total Price: ₹{totalPrice}</Typography>
        <div className="cart-summary-btns">
          <Button className="cart-checkout-btn" onClick={() => navigate("/checkout")}>Proceed to Checkout</Button>
          <Button className="cart-clear-btn" onClick={async () => { await dispatch(clearCart()); dispatch(fetchCart()); }}>Clear Cart</Button>
        </div>
      </div>
    </div>
  );
}
