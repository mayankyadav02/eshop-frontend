// src/redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios.js";

// ✅ Place new order
export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/orders", orderData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order creation failed");
    }
  }
);

// ✅ Get all orders of user
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/orders");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// ✅ Get single order detail
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order not found");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    order: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ fetchOrders
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      // ✅ fetchOrderById
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.order = action.payload;
      });
  },
});

export default orderSlice.reducer;
