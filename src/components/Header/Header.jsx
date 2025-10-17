// src/components/Header/Header.jsx
import React, { useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice.js";
import { fetchWishlist } from "../../redux/slices/wishlistSlice.js";
import { setSearchQuery } from "../../redux/slices/productSlice.js";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import "./Header.css";



const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    handleMenuClose();
  };

  // ✅ fetch wishlist on header load if user is logged in
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, userInfo]);

  const handleSearch = (query) => {
    dispatch(setSearchQuery(query));
  };

  // ✅ Switch Admin/User button handler
  const handleSwitch = () => {
    if (window.location.pathname.startsWith("/admin")) {
      navigate("/"); // if already on admin → switch to user home
    } else {
      navigate("/admin/dashboard"); // if on user pages → go to admin dashboard
    }
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
    
      <Toolbar className="MuiToolbar-root">
  {/* Left */}
  <Box className="header-left">
    <Link to="/">
      <Box component="img" src="assets/eshopLogo.png" alt="eshop logo" />
    </Link>
    <Button color="inherit" component={Link} to="/products">
      Products
    </Button>
  </Box>

  {/* Center */}
  <Box className="header-center">
    <SearchBar onSearch={handleSearch} />
  </Box>

  {/* Right */}
  <Box className="header-right">
    {/* Theme Toggle */}
    <Tooltip title={theme === "light" ? "Enable Dark Mode" : "Enable Light Mode"}>
      <IconButton color="inherit" onClick={toggleTheme}>
        {theme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>

    {!userInfo ? (
      <Button color="inherit" component={Link} to="/login">
        Login
      </Button>
    ) : (
      <Button color="inherit" onClick={() => navigate("/profile")}>
        {userInfo.name}
      </Button>
    )}

    <IconButton color="inherit" onClick={() => navigate("/wishlist")}>
      <Badge badgeContent={wishlistItems?.length || 0} color="error">
        <FavoriteIcon />
      </Badge>
    </IconButton>

    <IconButton color="inherit" onClick={() => navigate("/cart")}>
      <Badge badgeContent={cartItems?.length || 0} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>

    {userInfo?.role === "admin" && (
      <Button variant="outlined" color="inherit" size="small" onClick={handleSwitch}>
        {window.location.pathname.startsWith("/admin") ? "Switch to User" : "Switch to Admin"}
      </Button>
    )}

    {userInfo && (
      <>
        <IconButton color="inherit" onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem onClick={() => { navigate("/orders"); handleMenuClose(); }}>Orders</MenuItem>
          <MenuItem onClick={() => { navigate("/wishlist"); handleMenuClose(); }}>Wishlist</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </>
    )}
  </Box>
</Toolbar>

    </AppBar>
  );
};

export default Header;
