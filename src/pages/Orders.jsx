import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/orderSlice.js";
import { useNavigate } from "react-router-dom";
import "../style/orderPage.css";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;

  if (!list.length)
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>No orders found ❌</div>;

  return (
    <div className="orders-page">
      <h2 className="orders-title">My Orders</h2>

      {list.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-card-content order-id">Order #{order._id}</div>
          <div className="order-card-content order-details">
            Total: ₹{order.totalPrice} | Status: <strong>{order.orderStatus}</strong>
          </div>

          <div className="order-divider"></div>

          <div className="order-card-content order-details">
            {order.items.length} items | Payment: {order.paymentMethod}
          </div>

          <button className="order-btn" onClick={() => navigate(`/orders/${order._id}`)}>
            View Details →
          </button>
        </div>
      ))}
    </div>
  );
}
