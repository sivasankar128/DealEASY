import React, { useState, useEffect } from "react";
import "../index.css";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    
    const fetchCartItems = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`http://localhost:8000/orders?userId=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          
          if (Array.isArray(data.cartItems)) {
            setCartItems(data.cartItems);
          } else {
            console.error("Invalid data received:", data);
            setCartItems([]); 
          }
        } else {
          console.error("Failed to fetch cart items.");
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
      }
    };

    fetchCartItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems || cartItems.length === 0) {
      alert("Cart is empty.");
      return;
    }
  
    const userId = localStorage.getItem("userId");
    const payload = {
      userId,
      cartItems: cartItems,
      formData: formData,
    };
  
    try {
      const response = await fetch("http://localhost:8000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("Order placed successfully!");
        
      } else {
        const error = await response.json();
        alert(`Failed to place order: ${error.error}`);
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("An error occurred while placing the order.");
    }
  };
  
  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-cart-summary">
        <h2>Cart Summary</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <p>
                {item.name} - {item.quantity} x ${item.price}
              </p>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
      </div>

      <div className="checkout-form">
        <h2>Enter Your Details</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
