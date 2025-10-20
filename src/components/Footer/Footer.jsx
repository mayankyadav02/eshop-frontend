// src/components/Footer/Footer.jsx
import React, { useContext } from "react";
import { Box, Typography, Grid, Link, Divider, Container } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import "./Footer.css";

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Box
      component="footer"
      className={`footer-container ${theme === "dark" ? "dark-mode" : "light-mode"}`}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-title">
              eShop
            </Typography>
            <Typography variant="body2" className="footer-text">
              Your one-stop destination for electronics, fashion, and more.
              Trusted by thousands since 2020.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-title">
              Quick Links
            </Typography>
            <Link href="/" className="footer-link">Home</Link>
            <Link href="/products" className="footer-link">Products</Link>
            <Link href="/cart" className="footer-link">Cart</Link>
            <Link href="/wishlist" className="footer-link">Wishlist</Link>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-title">
              Customer Service
            </Typography>
            <Link href="/orders" className="footer-link">My Orders</Link>
            <Link href="/profile" className="footer-link">My Account</Link>
            <Link href="/faq" className="footer-link">FAQs</Link>
            <Link href="/contact" className="footer-link">Contact Us</Link>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-title">
              Contact
            </Typography>
            <Typography variant="body2" className="footer-text">📍 Jaipur, Rajasthan, India</Typography>
            <Typography variant="body2" className="footer-text">📞 +91 98765 43210</Typography>
            <Typography variant="body2" className="footer-text">✉️ support@eshop.com</Typography>
          </Grid>
        </Grid>

        <Divider className="footer-divider" />

        {/* Copyright */}
        <Box textAlign="center" className="footer-bottom">
          <Typography variant="body2">
            © {new Date().getFullYear()} eShop. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
