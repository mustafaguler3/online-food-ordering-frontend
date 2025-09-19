/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import userService from "../../../services/userService";
import { AuthHelper } from "../../../helpers/AuthHelper";
import { useNavigate } from "react-router-dom";
import { useError } from "../../common/ErrorDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { User } from "../../../models/User";

export const DeliveryTopbar = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response: any = await userService.myProfile();
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
    AuthHelper.logout();
    //navigate("/login");
    window.location.href = "/login"; // we reload page & direct login page
  };

  const clickOnImage = () => {
    navigate("/profile")
  }

  const toggleSidebar = () => {
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
            onClick={clickOnImage}
            src={`http://localhost:8081` + userProfile?.profileUrl}
            alt="User Profile"
            className="profile-image"
          />
          <div className="profile-info">
            <span className="profile-name">{userProfile?.name}</span>
            <span className="profile-role">Delivery</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </div>
    </header>
  );
};
