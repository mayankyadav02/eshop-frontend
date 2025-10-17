// src/router.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProductDetail from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetail from './pages/OrderDetails.jsx';
import Profile from './pages/Profile.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AdminProducts from './pages/Admin/Products.jsx';
import AdminOrders from './pages/Admin/Orders.jsx';
import AdminUsers from './pages/Admin/Users.jsx';
import AdminReports from './pages/Admin/Reports.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import AdminLayout from './pages/Admin/AdminLayout.jsx';
import AdminCategories from './pages/Admin/Categories.jsx';
import Products from './pages/Product.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/category/:idOrSlug" element={<CategoryPage />} />
      
      {/* Protected Routes */}
      <Route path="/cart" element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path="/wishlist" element={
        <ProtectedRoute>
          <Wishlist />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/orders/:id" element={
        <ProtectedRoute>
          <OrderDetail />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
      }>
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      </Route>
    
</Routes>
  );
};

export default AppRoutes;