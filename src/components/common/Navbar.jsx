import { useNavigate, Link } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { cartItemCount } = useCart();

  const isAuthenticated = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();
  const isCustomer = ApiService.isCustomer();
  const isDeliveryPerson = ApiService.isDeliveryPerson();
  const navigate = useNavigate();

  const handleLogout = () => {
    const isLogout = window.confirm("Are you sure you want to logout?");
    if (isLogout) {
      ApiService.logout();
      navigate("/login");
    }
  };

  return (
    <nav>
      <div className="logo">
        <Link to="/" className="logo-link">
          Food App
        </Link>
      </div>

      <div className="desktop-nav">
        <Link to="/home" className="nav-link">
          Home
        </Link>
        <Link to="/menu" className="nav-link">
          Menu
        </Link>
        <Link to="/categories" className="nav-link">
          Categories
        </Link>

        {isAuthenticated ? (
          <>
            {isCustomer &&
              ((
                <Link to="/orders" className="nav-link">
                  Orders
                </Link>
              ),
              (
                <Link to="/cart" className="nav-link">
                  <ShoppingCart size={25} />
                  <Badge badgeContent={cartItemCount} color="secondary"></Badge>
                </Link>
              ))}
            {isDeliveryPerson && (
              <Link to="/deliveries" className="nav-link">
                Deliveries
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
