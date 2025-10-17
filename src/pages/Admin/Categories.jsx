import React, { useEffect, useState } from "react";
import {
  Grid, Typography, CircularProgress,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit dialog state
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(data);
    } catch (err) {
      console.error("Fetch categories error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      await axios.delete(`/api/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error("Delete category error:", err);
    }
  };

  // Open Add dialog
  const handleAdd = () => {
    setFormData({ name: "", description: "" });
    setEditId(null);
    setOpen(true);
  };

  // Open Edit dialog
  const handleEdit = (cat) => {
    setFormData({ name: cat.name, description: cat.description || "" });
    setEditId(cat._id);
    setOpen(true);
  };

  // Save (Add or Edit)
  const handleSave = async () => {
    try {
      if (editId) {
        // Update
        const { data } = await axios.put(
          `/api/admin/categories/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(prev =>
          prev.map(c => (c._id === editId ? data : c))
        );
      } else {
        // Create
        const { data } = await axios.post(
          "/api/admin/categories",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(prev => [...prev, data]);
      }
      setOpen(false);
    } catch (err) {
      console.error("Save category error:", err);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">Category Management</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAdd}>
          Add Category
        </Button>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.map(cat => (
                <TableRow key={cat._id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEdit(cat)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => deleteCategory(cat._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
