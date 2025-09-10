/* eslint-disable react/jsx-no-undef */
import { NavLink, useNavigate } from "react-router-dom";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { AuthHelper } from "../../../helpers/AuthHelper";
import "./DeliverySidebar.css";

export const DeliverySidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure logout?")) {
      AuthHelper.logout();
      navigate("/login");
      window.location.reload();
    }
  };

  return (
    <div className="delivery-sidebar">
      <h2>🛵 Delivery Panel</h2>
      <ul>
        <li>
          <NavLink
            to="/delivery/orders/assigned"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <LocalShippingIcon /> Assigned Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/delivery/completed"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <CheckCircleIcon /> Delivered Orders
          </NavLink>
        </li>
        <li onClick={handleLogout}>
          <span className="logout-link">
            <ExitToAppIcon /> Logout
          </span>
        </li>
      </ul>
    </div>
  );
};
