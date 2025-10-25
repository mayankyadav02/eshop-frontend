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
import "../style/productDetailPage.css";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    dispatch(fetchProductById(id));
    fetchReviews();
  }, [dispatch, id]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`);
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
        `${import.meta.env.VITE_API_URL}/api/reviews`,
        { productId: id, rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      alert("Review submitted ✅");
      setRating(0);
      setComment("");
      fetchReviews();
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
  if (!product)
    return <Typography align="center">Product not found</Typography>;

  const imgUrl = getImageUrl(product.images || product.imageUrl || product.image);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToWishlist = async () => {
    try {
      await dispatch(addToWishlist(product._id)).unwrap();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert(err || "Already in wishlist");
    }
  };

  return (
<div className="product-detail-page">
  {/* Product Image */}
  <div className="product-image-wrapper">
    <img
      src={imgUrl}
      alt={product.name}
      className="product-image"
      onError={(e) => (e.target.src = "/placeholder.png")}
    />
  </div>

  {/* Product Info */}
  <Card className="product-info-card">
    <CardContent>
      <Typography className="product-title">{product.name}</Typography>
      <Typography className="product-price">₹{product.price}</Typography>
      <Typography className="product-description">{product.description}</Typography>
      <Typography
        className={`stock-status ${product.stock > 0 ? "stock-in" : "stock-out"}`}
      >
        {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
      </Typography>

      {/* Buttons */}
      <div className="product-buttons">
        <Button
          className="product-btn primary"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>

        <Button className="product-btn secondary" onClick={handleAddToWishlist}>
          {wishlistItems?.some((i) => i._id === product._id)
            ? "In Wishlist ❤️"
            : "Add to Wishlist 🤍"}
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* Review Form */}
  {userInfo && (
    <Card className="review-card">
      <Typography variant="h6" gutterBottom>
        Write a Review
      </Typography>
      <form className="review-form" onSubmit={handleReviewSubmit}>
        <Rating name="rating" value={rating} onChange={(e, newVal) => setRating(newVal)} />
        <TextField
          label="Your Comment"
          fullWidth
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button type="submit">Submit Review</Button>
      </form>
    </Card>
  )}

  {/* Reviews List */}
  <Card className="review-card">
    <Typography variant="h6" gutterBottom>
      Reviews
    </Typography>
    {reviews.length === 0 ? (
      <Typography>No reviews yet 😔</Typography>
    ) : (
      reviews.map((r) => (
        <div key={r._id} className="review-item">
          <Rating value={r.rating} readOnly size="small" />
          <Typography variant="body2">{r.comment}</Typography>
          <Typography variant="caption" color="text.secondary">
            by {r.user?.name || "Anonymous"}
          </Typography>
        </div>
      ))
    )}
  </Card>
</div>
  );
}