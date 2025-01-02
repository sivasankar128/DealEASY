import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../index.css";


const Header = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    alert("You have been logged out.");
    navigate("/");
    return; 
  };
  return (
    <header>
      <div className="header">
        <h1>DealEASY</h1>
            <nav className="topnav">
            <Link className="links" to={isAdmin ? "/admin" : "/products"}>Home</Link>
            {!isAdmin && <Link className="links" to="/cart">Cart</Link>}
            {isAdmin && <Link className="links" to="/products">Products</Link>}
            {!isAdmin && <Link className="links" to="/user">Profile</Link>}
            {isAdmin && <button className="linklogout" onClick={handleLogout} >Logout</button>}
            </nav>
       
      </div>
    </header>
  );
};
export default Header;
