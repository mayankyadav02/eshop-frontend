import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { Link } from "react-router-dom";
import getImageUrl from "../utils/getImageUrl";
import Slider from "react-slick";
import "../style/homePage.css";

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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products?top=true`)
      .then((res) => res.json())
      .then((data) => {
        setTopProducts(data.products || []);
        setIsFilteredMode(false);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!searchQuery && !selectedCategory && !sortOption) {
      setIsFilteredMode(false);
      setFilteredProducts([]);
      setPage(1);
      return;
    }

    setIsFilteredMode(true);
    const params = new URLSearchParams();
    if (searchQuery) params.append("keyword", searchQuery);
    if (selectedCategory) params.append("category", selectedCategory);
    if (sortOption) params.append("sortBy", sortOption);

    fetch(`${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredProducts(data.products || []);
        setPage(1);
      })
      .catch((err) => console.error(err));
  }, [searchQuery, selectedCategory, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = isFilteredMode
    ? filteredProducts.slice((page - 1) * productsPerPage, page * productsPerPage)
    : topProducts;

  return (
    <div className="home-container">
      <div className="offer-slider">
        <Slider {...sliderSettings}>
          {offerImages.map((img, idx) => (
            <div key={idx}>
              <img src={img} alt={`Offer ${idx + 1}`} onError={(e) => (e.target.src = "/placeholder.png")} />
            </div>
          ))}
        </Slider>
      </div>

      <div className="filter-row">
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="rating">Top Rated</option>
          <option value="reviews">Most Reviewed</option>
          <option value="newest">Newest</option>
          <option value="lowest">Lowest Price</option>
          <option value="highest">Highest Price</option>
        </select>
      </div>

      <div className="products-grid">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((p) => {
            const imgUrl = getImageUrl(p.images || p.imageUrl || p.image);
            const title = p.product_name || p.name || "Unnamed Product";
            return (
              <div className="product-card" key={p._id}>
                <img src={imgUrl} alt={title} onClick={() => window.location.assign(`/product/${p._id}`)} />
                <div className="product-card-content">
                  <div className="product-card-title">{title}</div>
                  <div className="product-card-price">₹{p.price}</div>
                  <div className="product-card-rating">⭐ {p.overall_rating?.toFixed(1) || 0} | {p.total_reviews || 0} Reviews</div>
                  <Link className="product-card-link" to={`/product/${p._id}`}>View Details</Link>
                </div>
              </div>
            );
          })
        ) : (
          <div>No products found 😔</div>
        )}
      </div>

      {isFilteredMode && totalPages > 1 && (
        <div className="pagination-container">
          {[...Array(totalPages)].map((_, idx) => (
            <button key={idx} className={page === idx + 1 ? "active" : ""} onClick={() => setPage(idx + 1)}>
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
