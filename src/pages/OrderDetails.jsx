import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import "../style/orderDetailPage.css";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [returning, setReturning] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch order details!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? ❌")) return;
    try {
      setCanceling(true);
      const { data } = await axios.put(`/api/orders/${id}/cancel`);
      alert("Order cancelled successfully ✅");
      setOrder(data);
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order!");
    } finally {
      setCanceling(false);
    }
  };

  const handleReturnRequest = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for return.");
      return;
    }
    if (!window.confirm("Do you want to request a return for this order? 🔄")) return;
    try {
      setReturning(true);
      const { data } = await axios.put(`/api/orders/${id}/return`, { reason });
      alert("Return request submitted ✅");
      setOrder(data.order);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to request return!");
    } finally {
      setReturning(false);
    }
  };

  if (loading)
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;

  if (!order)
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Order not found ❌</div>;

  return (
    <div className="order-page">
      <button className="order-btn order-btn-outlined" onClick={() => navigate("/orders")}>
        ← Back to Orders
      </button>

      <h2 className="order-title">Order Details</h2>

      <div className="order-card">
        <div className="order-card-content">
          <strong>Order ID:</strong> {order._id}
        </div>
        <div className="order-card-content">
          <span>Total: ₹{order.totalPrice} | Payment: {order.paymentMethod || "Pending"} | Status: <strong>{order.orderStatus || "Processing"}</strong></span>
        </div>

        <hr />

        <h4 className="order-subtitle">Shipping Details</h4>
        <p>{order.shippingAddress?.fullName}</p>
        <p>{order.shippingAddress?.addressLine}</p>
        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
        <p>{order.shippingAddress?.phone}</p>
        <p>{order.shippingAddress?.email}</p>

        <hr />

        <h4 className="order-subtitle">Products</h4>
        {order.items.map((item, idx) => (
          <div key={idx} className="order-card-content">
            <img src={item.product?.image || "/placeholder.png"} alt={item.product?.name} />
            <div>
              <p>{item.product?.name || "Product"}</p>
              <p>₹{item.price} × {item.quantity}</p>
            </div>
          </div>
        ))}

        {order.orderStatus === "Processing" && (
          <button className="order-btn order-btn-cancel" disabled={canceling} onClick={handleCancelOrder}>
            {canceling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}

        {order.orderStatus === "Cancelled" && (
          <p style={{ color: "red", marginTop: "1rem" }}>This order is cancelled ❌</p>
        )}

        {order.orderStatus === "Delivered" && !order.returnRequested && (
          <div style={{ marginTop: "1.5rem" }}>
            <h4 className="order-subtitle">Request a Return</h4>
            <div className="order-input">
              <textarea rows={2} placeholder="Enter reason for return" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <button className="order-btn order-btn-return" disabled={returning} onClick={handleReturnRequest}>
              {returning ? "Submitting..." : "Request Return"}
            </button>
          </div>
        )}

        {order.returnRequested && (
          <p style={{ color: "orange", marginTop: "1rem" }}>
            ✅ Return requested for this order. Reason: {order.returnReason}
          </p>
        )}
      </div>
    </div>
  );
}
