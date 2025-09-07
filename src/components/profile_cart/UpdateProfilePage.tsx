import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../profile_cart/UpdateProfile.css";
import { useError } from "../common/ErrorDisplay";
import userService from "../../services/userService";
import { AuthHelper } from "../../helpers/AuthHelper";
import { useUser } from "../../context/UserContext";

const UpdateProfilePage = () => {
  const { user,setUser,fetchUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response: any = await userService.myProfile();
        if (response.statusCode === 200) {
          const user = response.data;
          setName(user.name);
          setEmail(user.email);
          setPhoneNumber(user.phoneNumber);
          setAddress(user.address);
          setPreviewImage(
            user.profileUrl ? `http://localhost:8081${user.profileUrl}` : ""
          );
        }
      } catch (error: any) {
        showError(error.response?.data?.message || error.message);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      if (profileImage instanceof File) {
        formData.append("imageFile", profileImage);
      }

      const response: any = await userService.updateProfile(formData);

      if (response.statusCode === 200) {
        toast.success("Profile updated successfully");
        setUser(response.data)
        navigate("/profile");
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account?"))
      return;

    try {
      const response: any = await userService.deactiveAccount();
      if (response.statusCode === 200) {
        AuthHelper.logout();
        navigate("/home");
      }
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="update-profile-page">
      <ErrorDisplay />
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-container" onClick={triggerFileInput}>
            <img
              src={previewImage || "/default-avatar.png"}
              alt="Profile"
              className="avatar"
            />
            <span className="change-photo">Change</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeactivate}
            >
              Deactivate Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
