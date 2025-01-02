import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import Loginsignup from "./pages/Loginsignup.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage.jsx";


const App = () => {
  
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/products" element={<HomePage />} />
        <Route path="/" element={<Loginsignup/>} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/user" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
