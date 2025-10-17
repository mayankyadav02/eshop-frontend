// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { addToWishlist } from "../redux/slices/wishlistSlice";
import {
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  TextField,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import axios from "axios";
import getImageUrl from "../utils/getImageUrl";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  // Fetch product + reviews
  useEffect(() => {
    dispatch(fetchProductById(id));
    fetchReviews();
  }, [dispatch, id]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Reviews fetch error:", err);
      setReviews([]);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      alert("Login required to write a review");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        { productId: id, rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      alert("Review submitted ✅");
      setRating(0);
      setComment("");
      fetchReviews(); // refresh reviews
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  if (error)
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  if (!product) return <Typography align="center">Product not found</Typography>;

  // Image parsing
let imgUrl = getImageUrl(product.images || product.imageUrl || product.image);
// console.log("🖼️ Product Image Data:", product.images || product.imageUrl || product.image);
// console.log("✅ Final Image URL:", imgUrl);
// if (!imgUrl) {
//   console.warn("⚠️ No valid image found for product:", product.name);
//   imgUrl = "/placeholder.png";
// }


  // Add to Cart
  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
     window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add to Wishlist
  const handleAddToWishlist = async () => {
    try {
      await dispatch(addToWishlist(product._id)).unwrap();
      window.scrollTo({ top: 0, behavior: "smooth" });
      // alert("Product added to wishlist");
    } catch (err) {
      alert(err || "Already in wishlist");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Grid container spacing={3}>
        {/* Left: Image */}
        <Grid item xs={12} md={6}>
          <img
            src={imgUrl}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: "500px",
              objectFit: "cover",
              borderRadius: "8px",
              opacity: product.stock === 0 ? 0.5 : 1,
            }}
            onError={(e) => {
              (e.target.src = "/placeholder.png");
              // console.error("Image load failed:", imgUrl);
            }}
          />
        </Grid>

{/* Right: Product Info */}
<Grid item xs={12} md={6}>
  <Card>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        ₹{product.price}
      </Typography>

      <Typography variant="body1" gutterBottom>
        {product.description}
      </Typography>

      {/* ✅ Stock Status */}
      <Typography
        variant="body2"
        sx={{
          color: product.stock > 0 ? "green" : "red",
          fontWeight: "bold",
          mt: 1,
        }}
      >
        {product.stock > 0
          ? `In Stock (${product.stock} available)`
          : "Out of Stock"}
      </Typography>

      {/* ✅ Buttons */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, mr: 2 }}
        onClick={handleAddToCart}
        disabled={product.stock === 0} // disable if out of stock
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={handleAddToWishlist}
      >
        {wishlistItems?.some((i) => i._id === product._id)
          ? "In Wishlist ❤️"
          : "Add to Wishlist 🤍"}
      </Button>
    </CardContent>
  </Card>

          {/* Review Form */}
          {userInfo && (
            <Card sx={{ mt: 3, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Write a Review
              </Typography>
              <form onSubmit={handleReviewSubmit}>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(e, newVal) => setRating(newVal)}
                />
                <TextField
                  label="Your Comment"
                  fullWidth
                  multiline
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  Submit Review
                </Button>
              </form>
            </Card>
          )}

          {/* Reviews List */}
          <Card sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Reviews
            </Typography>
            {reviews.length === 0 ? (
              <Typography>No reviews yet 😔</Typography>
            ) : (
              reviews.map((r) => (
                <div key={r._id} style={{ marginBottom: "1rem" }}>
                  <Rating value={r.rating} readOnly size="small" />
                  <Typography variant="body2">{r.comment}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    by {r.user?.name || "Anonymous"}
                  </Typography>
                </div>
              ))
            )}
          </Card>
        </Grid>
      </Grid>
      <Divider sx={{ my: 4 }} />
    </div>
  );
}
