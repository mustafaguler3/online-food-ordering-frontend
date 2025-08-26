import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../services/ApiService";
import { useError } from "../../common/ErrorDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";

const AdminTopbar = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiService.myProfile();
        if (response.statusCode === 200) {
          setUserProfile(response.data);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    ApiService.logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    // Implement sidebar toggle logic if needed for mobile
    document.querySelector(".admin-sidebar").classList.toggle("active");
  };

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <ErrorDisplay />
      <div className="topbar-right">
        <div className="user-profile">
          <img
            src={userProfile?.profileUrl}
            alt="User Profile"
            className="profile-image"
          />
          <div className="profile-info">
            <span className="profile-name">{userProfile?.name || "Admin"}</span>
            <span className="profile-role">Admin</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
