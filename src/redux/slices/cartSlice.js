import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios.js";

// Get user cart
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/cart");
      return data.items; // backend se hamesha items array
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/cart/add", { productId, quantity });
      return data.items; // backend se updated items array
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add item");
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/cart/remove", { productId }); // POST, backend ke according
      return data.items; // backend se updated items array
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove item");
    }
  }
);

// Clear Cart
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/cart/clear");
      return data.items; // backend se empty array ya updated cart
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear cart");
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
    
      .addCase(clearCart.fulfilled, (state, action) => {
      state.items = action.payload || [];
      });

  },
});

export default cartSlice.reducer;
