import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  TablePagination,
} from "@mui/material";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    retail_price: "",
    stock: "",
    category: "",
    description: "",
  });
  const [image, setImage] = useState(null);

  const { token } = useAuth();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch Products with pagination
const fetchProducts = async () => {
  try {
    const res = await axios.get(
      `/api/admin/products?limit=${rowsPerPage}&skip=${page * rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // const data = await res.json();
    // console.log("API Response:", data);
    setProducts(res.data.products || []);
    setTotalProducts(res.data.total || 0);
  } catch (err) {
    console.error("Products fetch error:", err);
  }
};

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Categories fetch error:", err);
    }
  };

useEffect(() => {
  if (token) {
    fetchProducts();
  }
}, [token, page, rowsPerPage]);  // sirf products ke liye

useEffect(() => {
  if (token) {
    fetchCategories();
  }
}, [token]);  // categories ek hi baar
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (product = null) => {
    setEditProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        price: product.retail_price,
        stock: product.stock,
        category: product.category?._id || product.category,
        description: product.description,
      });
    } else {
      setFormData({ name: "", price: "", stock: "", category: "", description: "" });
    }
    setImage(null);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("retail_price", formData.price);
      form.append("stock", formData.stock);
      form.append("categoryId", formData.category);
      form.append("description", formData.description);
      if (image) form.append("image", image);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editProduct) {
        await axios.put(`/api/admin/products/${editProduct._id}`, form, config);
      } else {
        await axios.post("/api/admin/products", form, config);
      }

      setOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleStockUpdate = async (id, stock) => {
    try {
      await axios.patch(`/api/admin/products/${id}/stock`, { stock }, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
    } catch (err) {
      console.error("Stock update error:", err);
    }
  };

  const handleCategoryChange = async (id, categoryId) => {
    try {
      await axios.patch(`/api/admin/products/${id}/category`, { categoryId }, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
    } catch (err) {
      console.error("Category assign error:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Products
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add Product
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
<TableBody>
            {products?.map((p) => (
    <TableRow key={p._id}>
      <TableCell>
        <img
          src={p.imageUrl ? `http://localhost:5000${p.imageUrl}` : "placeholder.png"}
          alt={p.name}
          width="60"
          style={{ borderRadius: "6px" }}
          loading="lazy"
        />
      </TableCell>
      <TableCell>{p.name}</TableCell>
      {/* ✅ price ko retail_price se fix kiya */}
      <TableCell>₹{p.retail_price || p.price || 0}</TableCell>
      <TableCell>
        <TextField
          type="number"
          value={p.stock}
          onChange={(e) => handleStockUpdate(p._id, e.target.value)}
          size="small"
          style={{ width: "80px" }}
        />
      </TableCell>
      <TableCell>
        <TextField
          select
          value={p.category?._id || ""}
          onChange={(e) => handleCategoryChange(p._id, e.target.value)}
          size="small"
          style={{ minWidth: "120px" }}
        >
          {categories.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>
      <TableCell>
        <Button size="small" onClick={() => handleOpen(p)}>Edit</Button>
        <Button size="small" color="error" onClick={() => handleDelete(p._id)}>Delete</Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalProducts || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <TextField
            label="Stock"
            type="number"
            fullWidth
            margin="normal"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
          <TextField
            select
            label="Category"
            fullWidth
            margin="normal"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ marginTop: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
