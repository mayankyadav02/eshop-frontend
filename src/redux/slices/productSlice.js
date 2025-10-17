// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios.js";

// ✅ Fetch all products
// export const fetchProducts = createAsyncThunk(
//   "products/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get("/api/products");
//       return data;
//     } catch (err) {
//       return rejectWithValue(err.response.data.message || "Failed to fetch products");
//     }
//   }
// );
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const queryString = params
        ? "?" +
          Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&")
        : "";

      const { data } = await axios.get(`/api/products${queryString}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);


// ✅ Fetch single product
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Product not found");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    product: null,
    loading: false,
    error: null,
    searchQuery: "",
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // ✅ fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery } = productSlice.actions;
export default productSlice.reducer;
