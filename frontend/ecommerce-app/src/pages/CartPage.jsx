import React, { useEffect, useState } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  
 
  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = localStorage.getItem("userId"); 
      if (!userId) {
        alert("Please log in to view your cart.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/orders?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.cartItems); 
          setTotalPrice(data.totalPrice); 
        } else {
          console.error("Failed to fetch cart items:", response.status);
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
      }
    };

    fetchCartItems();
  }, []);

  const removeFromCart = async (item_id) => {
    try {
      const response = await fetch(`http://localhost:8000/orders/${item_id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        alert("Item removed successfully.");
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== item_id));
        window.location.reload();
      } else {
        console.error("Failed to remove item:", response.status);
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };


  const handleCheckout = async () => {
    navigate("/checkout");  
  };

  return (
    <div className="cart-page">
      <h1 style={{textAlign:"center"}}>Cart</h1>
      {cartItems.length > 0 ? (
        
        <div>
          <div className="cartlist">
          <ul>
          {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="itemcart">
                  <h2>{item.name}</h2>
                  <p>${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.item_id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          </div>
          <div className="chout">
          <h3>Total: ${totalPrice}</h3>
          <button onClick={handleCheckout} className="checkout-btn">
            Checkout
          </button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
