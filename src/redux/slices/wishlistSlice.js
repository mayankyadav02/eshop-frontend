import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios.js";

// ✅ Fetch wishlist (no-cache to prevent 304)
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/wishlist", { headers: { "Cache-Control": "no-cache" } });
      return data; // backend should return { items: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

// ✅ Add to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/wishlist/add", { productId });
      return data.items || []; // backend should return updated wishlist items array
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

// remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/wishlist/remove", { productId });
      return data.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

// clear wishlist
export const clearWishlist = createAsyncThunk(
  "wishlist/clear",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/wishlist/clear");
      return data.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear wishlist");
    }
  }
);


const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || state.items;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // remove
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      // clear all
      .addCase(clearWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = []; // ✅ completely empty
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
