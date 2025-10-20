import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist, clearWishlist } from "../redux/slices/wishlistSlice.js";
import { Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import getImageUrl from "../utils/getImageUrl.js";
import "../style/wishlistPage.css"; // ✅ external CSS import

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  if (loading) return <div className="wishlist-loading"><CircularProgress /></div>;
  if (error) return <Typography className="wishlist-error">{error}</Typography>;
  if (!items || items.length === 0)
    return <Typography className="wishlist-empty">Your wishlist is empty 💔</Typography>;

  return (
    <div className="wishlist-page">
      {/* Header Row */}
      <div className="wishlist-header">
        <Typography variant="h4" className="wishlist-title">My Wishlist</Typography>
        <Button className="wishlist-clear-btn" onClick={handleClear}>Clear Wishlist</Button>
      </div>

      {/* Grid of Products */}
      <Grid container spacing={3} className="wishlist-grid">
        {items.map((item) => {
          const product = products.find((p) => p._id === item._id);
          let imgUrl = "/placeholder.png";
          if (product?.images?.length) imgUrl = getImageUrl(product.images);

          return (
            <Grid item xs={12} sm={6} md={6} lg={3} key={item._id}>
              <Card className="wishlist-card">
                <div 
                  className="wishlist-card-img-wrapper"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <CardMedia
                    component="img"
                    image={imgUrl}
                    alt={item.name || "Wishlist Product"}
                    className="wishlist-card-img"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <CardContent className="wishlist-card-content">
                    <Typography className="wishlist-card-title">{item.name}</Typography>
                    <Typography className="wishlist-card-price">₹{item.price}</Typography>
                  </CardContent>
                </div>
                <CardContent>
                  <Button className="wishlist-remove-btn" onClick={() => handleRemove(item._id)}>Remove</Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
