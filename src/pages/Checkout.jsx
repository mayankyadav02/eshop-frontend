import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.js"; 
import { clearCart, fetchCart } from "../redux/slices/cartSlice";
import "../style/checkoutPage.css";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const cartItems = Array.isArray(items) ? items : items?.cartItems || [];
  const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const [userDetails, setUserDetails] = useState({ name: "", email: "", phone: "", address: "" });
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  const handleCardChange = (e) => setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    if (!userDetails.name || !userDetails.address || !userDetails.phone) {
      alert("Please fill all shipping details!");
      return;
    }
    if (cardDetails.number.length < 12 || !cardDetails.expiry.includes("/") || cardDetails.cvc.length < 3) {
      alert("Enter valid dummy card details!");
      return;
    }

    setLoading(true);
    try {
      alert("Payment Successful! Placing order ✅");

      const orderData = {
        shippingAddress: { ...userDetails },
        paymentMethod: "Card (Dummy)",
      };

      const { data } = await axios.post("/api/orders", orderData);
      await dispatch(clearCart());
      dispatch(fetchCart());
      navigate(`/orders/${data._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to place order!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>
      <div className="checkout-grid">
        <div>
          <h3 className="checkout-subtitle">Cart Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id} className="checkout-card">
              <div className="checkout-card-content">
                <img src={item.product.images?.[0] || "/placeholder.png"} alt={item.product.name} />
                <div>
                  <p>{item.product.name}</p>
                  <p>₹{item.product.price} × {item.quantity} = ₹{item.product.price * item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
          <h3 className="checkout-subtitle">Total: ₹{totalPrice}</h3>
        </div>

        <div>
          <h3 className="checkout-subtitle">Shipping & Payment</h3>
          <div className="checkout-input">
            <input type="text" name="name" placeholder="Name" value={userDetails.name} onChange={handleChange} />
          </div>
          <div className="checkout-input">
            <input type="email" name="email" placeholder="Email" value={userDetails.email} onChange={handleChange} />
          </div>
          <div className="checkout-input">
            <input type="text" name="phone" placeholder="Phone" value={userDetails.phone} onChange={handleChange} />
          </div>
          <div className="checkout-input">
            <textarea name="address" rows="4" placeholder="Address" value={userDetails.address} onChange={handleChange}></textarea>
          </div>
          <div className="checkout-input">
  <input type="text" name="city" placeholder="City" value={userDetails.city} onChange={handleChange} />
          </div>
          <div className="checkout-input">
  <input type="text" name="state" placeholder="State / Province" value={userDetails.state} onChange={handleChange} />
          </div>
          <div className="checkout-input">
  <input type="text" name="zip" placeholder="ZIP / Postal Code" value={userDetails.zip} onChange={handleChange} />
</div>

          <h4 className="checkout-subtitle">Dummy Card Details</h4>
          <div className="checkout-input">
            <input type="text" name="number" placeholder="Card Number" value={cardDetails.number} onChange={handleCardChange} />
          </div>
          <div className="checkout-input">
            <input type="text" name="expiry" placeholder="Expiry (MM/YY)" value={cardDetails.expiry} onChange={handleCardChange} />
          </div>
          <div className="checkout-input">
            <input type="text" name="cvc" placeholder="CVC" value={cardDetails.cvc} onChange={handleCardChange} />
          </div>

          <button className="checkout-btn" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : `Pay ₹${totalPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
}
