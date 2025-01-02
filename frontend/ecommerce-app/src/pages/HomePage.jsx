import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../index.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let updatedProducts = products;

      if (searchQuery) {
        updatedProducts = updatedProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (categoryFilter) {
        updatedProducts = updatedProducts.filter(
          (product) => product.category === categoryFilter
        );
      }

      setFilteredProducts(updatedProducts);
    };

    applyFilters();
  }, [searchQuery, categoryFilter, products]);

  return (
    <div className="home-page">
      <h1>Product Listings</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products available</p>
      ) : (
        
        <div className="product-grid">
          
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
      )}
    </div>
  );
};

export default HomePage;
