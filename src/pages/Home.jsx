import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Pagination,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { Link } from "react-router-dom";
import getImageUrl from "../utils/getImageUrl";
import Slider from "react-slick";

export default function Home() {
  const dispatch = useDispatch();
  const { items = [], loading, error, searchQuery } = useSelector(
    (state) => state.products
  );

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilteredMode, setIsFilteredMode] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(1);

  const productsPerPage = 15;

  const offerImages = ["/assets/sale.jpg", "/assets/sale1.jpg"];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  // ✅ Fetch categories once
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  // ✅ Fetch top products initially
  useEffect(() => {
    fetch("http://localhost:5000/api/products?top=true")
      .then((res) => res.json())
      .then((data) => {
        setTopProducts(data.products || []);
        setIsFilteredMode(false);
      })
      .catch((err) => console.error("Fetch top products error:", err));
  }, []);

  // ✅ Redux fetch (if needed globally)
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ✅ Fetch filtered/sorted products dynamically
  useEffect(() => {
    // No active filters → show top products
    if (!searchQuery && !selectedCategory && !sortOption) {
      setIsFilteredMode(false);
      setFilteredProducts([]);
      setPage(1);
      return;
    }

    setIsFilteredMode(true);

    // Build query params dynamically
    const params = new URLSearchParams();
    if (searchQuery) params.append("keyword", searchQuery);
    if (selectedCategory) params.append("category", selectedCategory);
    if (sortOption) params.append("sortBy", sortOption);

    // Fetch combined result
    fetch(`http://localhost:5000/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredProducts(data.products || []);
        setPage(1);
      })
      .catch((err) => console.error("Filtered products fetch error:", err));
  }, [searchQuery, selectedCategory, sortOption]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = isFilteredMode
    ? filteredProducts.slice((page - 1) * productsPerPage, page * productsPerPage)
    : topProducts;

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      {/* ✅ Offer Slider */}
      <Box className="offer-slider" sx={{ width: '100%', mb: 3 }}>
        <Slider {...sliderSettings}>
          {offerImages.map((img, idx) => (
            <Box key={idx}>
              <img
                src={img}
                alt={`Offer ${idx + 1}`}
                // style={{
                //   width: "100%",
                //   height: "550px",
                //   objectFit: "cover",
                //   borderRadius: "8px",
                // }}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* ✅ Filters */}
      <Box className="filter-row" >
        {/* Category */}
        <FormControl fullWidth sx={{ minWidth: 150 }}>
          <InputLabel>Select Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Select Category"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Option */}
        <FormControl fullWidth sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            label="Sort By"
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="rating">Top Rated</MenuItem>
            <MenuItem value="reviews">Most Reviewed</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="lowest">Lowest Price</MenuItem>
            <MenuItem value="highest">Highest Price</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ✅ Product Grid */}
      <Grid container spacing={3}>
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((p) => {
            const imgUrl = getImageUrl(p.images || p.imageUrl || p.image);
            const title = p.product_name || p.name || "Unnamed Product";
            return (
              <Grid item xs={12} sm={6} md={3} key={p._id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imgUrl}
                    alt={title}
                    sx={{ objectFit: "contain", cursor: "pointer" }}
                    onClick={() => window.location.assign(`/product/${p._id}`)}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{p.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ⭐ {p.overall_rating?.toFixed(1) || 0} |{" "}
                      {p.total_reviews || 0} Reviews
                    </Typography>
                    <Link to={`/product/${p._id}`}>View Details</Link>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography variant="h6" sx={{ m: 2 }}>
            No products found 😔
          </Typography>
        )}
      </Grid>

      {/* ✅ Pagination */}
      {isFilteredMode && totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, val) => setPage(val)}
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
        />
      )}
    </div>
  );
}
