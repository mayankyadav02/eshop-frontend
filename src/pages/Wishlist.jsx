import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist, clearWishlist } from "../redux/slices/wishlistSlice.js";
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";  // ✅ Add navigation
import getImageUrl from "../utils/getImageUrl.js";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ navigation hook
  const { items, loading, error } = useSelector((state) => state.wishlist);
  const { items: products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (id) => {
    await dispatch(removeFromWishlist(id));
    dispatch(fetchWishlist());
  };

  const handleClear = async () => {
    await dispatch(clearWishlist());
    dispatch(fetchWishlist());
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!items || items.length === 0)
    return <Typography align="center" sx={{ mt: 5 }}>Your wishlist is empty 💔</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Wishlist</Typography>
      
      <Button
        variant="contained"
        color="error"
        sx={{ mb: 2 }}
        onClick={handleClear}
      >
        Clear Wishlist
      </Button>

      <Grid container spacing={3}>
        {items.map((item) => {
          const product = products.find((p) => p._id === item._id);

          let imgUrl = "/placeholder.png";
          if (product?.images?.length) {
            imgUrl = getImageUrl(product.images);
          }

          return (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Card>
                {/* ✅ Card clickable for navigation */}
                <div 
                  onClick={() => navigate(`/product/${item._id}`)} 
                  style={{ cursor: "pointer" }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={imgUrl}
                    alt={item.name || "Wishlist Product"}
                    sx={{ objectFit: "cover" }}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ₹{item.price}
                    </Typography>
                  </CardContent>
                </div>

                {/* Remove button as it is */}
                <CardContent>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
