import { useState, useEffect } from "react";
import ApiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.myProfile();
        if (response.statusCode === 200) {
          setUser(response.data);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    };
    fetchUserProfile();
  }, []);

  const navigateToEditPage = () => {
    navigate("/update");
  };

  const navigateToOrderHistory = () => {
    navigate("/my-order-history");
  };

  if (user) {
    return (
      <div className="profile-container">
        <ErrorDisplay />
        <h1 className="profile-title">User Profile</h1>
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-title">
              <div className="profile-avatar">
                {user.profileUrl ? (
                  <img
                    className="avatar-image"
                    src={user.profileUrl}
                    alt={user.name}
                  />
                ) : (
                  <div className="avatar-fallback">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="profile-name">{user.name}</span>
            </div>
          </div>
          <div className="profile-card-content">
            <div className="profile-info">
              <p>
                <span className="profile-info-label">Email:</span>
                <span>{user.email}</span>
              </p>
              <p>
                <span className="profile-info-label">Phone:</span>
                <span>{user.phoneNumber}</span>
              </p>
              <p>
                <span className="profile-info-label">Address:</span>
                <span>{user.address}</span>
              </p>
              <p>
                <span className="profile-info-label">Status:</span>
                <span
                  className={
                    user.active
                      ? "profile-status-active"
                      : "profile-status-inactive"
                  }
                >
                  {user.active ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
            <div className="profile-actions">
              <button
                onClick={navigateToEditPage}
                className="profile-edit-button"
              >
                Edit Profile
              </button>
              <button
                onClick={navigateToOrderHistory}
                className="profile-orders-button"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default ProfilePage;
