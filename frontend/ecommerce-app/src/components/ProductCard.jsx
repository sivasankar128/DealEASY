import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.image }
        alt={product.name}
        className="product-image"
      />
      <h2>{product.name}</h2>
      <p className="prod-price">${Number(product.price).toFixed(2)}</p>
      <br></br>
      <br></br>
     
      <Link to={`/products/${product.id}`} className="details-link">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
  
