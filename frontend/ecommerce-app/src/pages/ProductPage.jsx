import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../index.css";


const ProductPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/products/${id}`);

        if (response.ok) {
          const data = await response.json();
          setProduct(data); 
        } else {
          console.error("Failed to fetch product:", response.status);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    if (id) fetchProduct();
  }, [id]);


  const addToCart = async (product) => {
    try {
      const response = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"), 
          productId: product.id,
          quantity: 1,
          price: product.price,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        console.error("Failed to add item to cart");
      }
    } catch (err) {
      console.error("Error adding item to cart:", err);
    }
  };



  return product ? (
    <div className="product-page">
      <div className="product-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
        <div className="product-details">
          <h1>{product.name}</h1>
          <table>
            <tbody>
              <tr>
                <td><strong>Description:</strong></td>
                <td>{product.description}</td>
              </tr>
              <tr>
                <td><strong>Price:</strong></td>
                <td>${product.price}</td>
              </tr>
              <tr>
                <td><strong>Stock:</strong></td>
                <td>{product.stock}</td>
              </tr>
              <tr>
                <td><strong>Category:</strong></td>
                <td>{product.category}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <br />
          <br />
          <Link className="atc" onClick={() => {addToCart(product); }}>
            Add to Cart
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default ProductPage;
