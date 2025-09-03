/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Badge from "@mui/material/Badge";
import { useCart } from "../../context/CartContext";
import { useEffect } from "react";
import { AuthHelper } from "../../helpers/AuthHelper";

const Navbar = () => {
  const { fetchCart, cartItemCount } = useCart();

  const isAuthenticated = AuthHelper.isAuthenticated();
  const isAdmin = AuthHelper.isAdmin();
  const isCustomer = AuthHelper.isCustomer();
  const isDeliveryPerson = AuthHelper.isDeliveryPerson();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart()
  },[])

  const handleLogout = () => {
    const isLogout = window.confirm("Are you sure you want to logout?");
    if (isLogout) {
      AuthHelper.logout();
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
              (
                <>
                <Link to="/orders" className="nav-link">
                  Orders
                </Link>
              
              
                <Link to="/cart" className="nav-link">
                  <ShoppingCart size={25} />
                  <Badge badgeContent={cartItemCount} color="secondary"></Badge>
                </Link>
                </>
                
              )}
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
