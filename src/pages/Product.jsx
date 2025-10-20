import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Pagination,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Skeleton,
} from "@mui/material";
import { Link } from "react-router-dom";
import getImageUrl from "../utils/getImageUrl";
import "../style/productPage.css"; // ✅ external CSS import

const priceRanges = [
  { label: "All", value: "all" },
  { label: "₹0 - ₹500", value: "0-500" },
  { label: "₹501 - ₹1000", value: "501-1000" },
  { label: "₹1001 - ₹5000", value: "1001-5000" },
  { label: "₹5001+", value: "5001-100000" },
];

export default function Products() {
  const dispatch = useDispatch();
  const { items = [], loading, error, total, pages } = useSelector(
    (state) => state.products
  );

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 15;

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories([{ _id: "all", name: "All" }, ...data]))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  // Fetch products
  useEffect(() => {
    const params = { pageNumber: page, pageSize };
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (priceRange !== "all") params.priceRange = priceRange;
    if (rating > 0) params.rating = rating;
    if (sortBy) params.sortBy = sortBy;
    dispatch(fetchProducts(params));
  }, [dispatch, selectedCategory, priceRange, rating, sortBy, page]);

  if (error) return <div className="error">{error}</div>;

  return (
<div className="product-page">
  <Typography variant="h4" gutterBottom>
    All Products
  </Typography>
  <Typography variant="subtitle1" className="product-summary">
    Showing page {page} of {pages} — Total Products: {total}
  </Typography>

  {/* ✅ Filter Section */}
  <div className="filters-container">
    <FormControl className="filter-item">
      <InputLabel>Category</InputLabel>
      <Select
        value={selectedCategory}
        label="Category"
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setPage(1);
        }}
      >
        {categories.map((cat) => (
          <MenuItem key={cat._id} value={cat._id}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl className="filter-item">
      <InputLabel>Price Range</InputLabel>
      <Select
        value={priceRange}
        label="Price Range"
        onChange={(e) => {
          setPriceRange(e.target.value);
          setPage(1);
        }}
      >
        {priceRanges.map((pr) => (
          <MenuItem key={pr.value} value={pr.value}>
            {pr.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl className="filter-item">
      <InputLabel>Min Rating</InputLabel>
      <Select
        value={rating}
        label="Min Rating"
        onChange={(e) => {
          setRating(e.target.value);
          setPage(1);
        }}
      >
        <MenuItem value={0}>All</MenuItem>
        <MenuItem value={1}>⭐ 1+</MenuItem>
        <MenuItem value={2}>⭐ 2+</MenuItem>
        <MenuItem value={3}>⭐ 3+</MenuItem>
        <MenuItem value={4}>⭐ 4+</MenuItem>
      </Select>
    </FormControl>

    <FormControl className="filter-item">
      <InputLabel>Sort By</InputLabel>
      <Select
        value={sortBy}
        label="Sort By"
        onChange={(e) => {
          setSortBy(e.target.value);
          setPage(1);
        }}
      >
        <MenuItem value="">Default</MenuItem>
        <MenuItem value="lowest">Lowest Price</MenuItem>
        <MenuItem value="highest">Highest Price</MenuItem>
        <MenuItem value="newest">Newest</MenuItem>
        <MenuItem value="popular">Most Popular</MenuItem>
      </Select>
    </FormControl>
  </div>

  {/* ✅ Product Grid */}
  <Grid container spacing={3} className="product-grid">
    {loading
      ? [...Array(8)].map((_, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Card className="product-card">
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
                <Skeleton width="50%" />
              </CardContent>
            </Card>
          </Grid>
        ))
      : items.length > 0
      ? items.map((p) => {
          const imgUrl = getImageUrl(p.images || p.imageUrl || p.image);
          const title = p.product_name || p.name || "Unnamed Product";
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
              <Card className="product-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={imgUrl}
                  alt={title}
                  className="product-image"
                  onClick={() => window.location.assign(`/product/${p._id}`)}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <CardContent className="product-info">
                  <Typography variant="h6" noWrap>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{p.price || p.retail_price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ⭐ {p.overall_rating || 0}
                  </Typography>
                  <Link to={`/product/${p._id}`} className="view-details">
                    View Details
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          );
        })
      : (
          <Typography variant="h6" className="no-products">
            No products found 😔
          </Typography>
        )}
  </Grid>

  {pages > 1 && (
    <Pagination
      count={pages}
      page={page}
      onChange={(e, val) => setPage(val)}
      className="pagination"
    />
  )}
</div>
  );
}
