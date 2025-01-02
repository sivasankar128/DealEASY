import React, { useState, useEffect } from "react";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock:"",category: "",image:""});

  
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8000/checkout", {
        method: "GET", 
      });
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/allusers", {
        method: "GET", 
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
  
      if (response.ok) {
        alert("Product added successfully!");
        setNewProduct({ name: "", price: "", category: "", image: "" ,stock:""});
        fetchProducts(); 
      } else {
        const errorData = await response.json(); 
        alert(`Error adding product: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product. Please try again later.");
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Here you can manage products, view orders, and user information.</p>

      
      <section style={{ marginBottom: "30px" }}>
        <h2>Add a Product</h2>
        <form onSubmit={handleAddProduct} className="adminform">
          <input 
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
            className="admininput"
            style={{ marginRight: "10px" }}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
            className="admininput"
            style={{ marginRight: "10px" }}
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            required
            className="admininput"
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={newProduct.category}
            onChange={handleInputChange}
            required
            className="admininput"
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={handleInputChange}
            required
            className="admininput"
            style={{ marginRight: "10px" }}
          />
          <button type="submit" className="addprod">Add Product</button>
        </form>
      </section>

    <div className="adminn">
      <section style={{ marginBottom: "30px" }} className="sec">
        <h2>Order List</h2>
        <ul>
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order.checkout_id}>
            <strong>Order ID:</strong> {order.checkout_id}, <strong>User ID:</strong> {order.user_id}
            <div>
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Phone:</strong> {order.phone_number}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Address:</strong> {order.address}</p>
            </div>
          </li>
        
      ))
    ) : (
      <li>No orders available</li>
    )}
        </ul>
      </section>


        <section className="sec">
        <h2>User List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <div>
              <p><strong>Name:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Password:</strong> {user.password}</p>
            </div>
            </li>
          ))}
        </ul>
      </section>

      
      <section style={{ marginBottom: "30px" }} className="sec">
        <h2>Product List</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price} ({product.stock})
              
            </li>
          ))}
        </ul>
      </section>

      </div>

    </div>
  );
};

export default AdminPage;
