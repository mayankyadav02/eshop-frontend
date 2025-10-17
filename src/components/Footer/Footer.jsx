import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Link,
  Divider,
  Container,
} from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'grey.100', pt: 4, pb: 2 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              eShop
            </Typography>
            <Typography variant="body2">
              Your one-stop destination for electronics, fashion, and more. Trusted by thousands since 2020.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" underline="hover" display="block">Home</Link>
            <Link href="/products" color="inherit" underline="hover" display="block">Products</Link>
            <Link href="/cart" color="inherit" underline="hover" display="block">Cart</Link>
            <Link href="/wishlist" color="inherit" underline="hover" display="block">Wishlist</Link>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Link href="/orders" color="inherit" underline="hover" display="block">My Orders</Link>
            <Link href="/profile" color="inherit" underline="hover" display="block">My Account</Link>
            <Link href="/faq" color="inherit" underline="hover" display="block">FAQs</Link>
            <Link href="/contact" color="inherit" underline="hover" display="block">Contact Us</Link>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2">📍 Jaipur, Rajasthan, India</Typography>
            <Typography variant="body2">📞 +91 98765 43210</Typography>
            <Typography variant="body2">✉️ support@eshop.com</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: 'grey.700' }} />

        {/* Copyright */}
        <Box textAlign="center">
          <Typography variant="body2" color="grey.400">
            © {new Date().getFullYear()} eShop. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;