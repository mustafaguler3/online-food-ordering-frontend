import { useNavigate, Link, useLocation } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import { useState } from "react";
import ApiService from "../../services/ApiService";

const LoginPage = () => {
  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();
  const { state } = useLocation();
  const redirectPath = state?.from?.pathname || "/home";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showError("Email and password are required.");
      return;
    }

    try {
      const response = await ApiService.loginUser(formData);
      if (response.statusCode === 200) {
        ApiService.saveToken(response.data.token);
        ApiService.saveRole(response.data.roles);
        navigate(redirectPath, { replace: true });
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="login-page-food">
      <ErrorDisplay />
      <div className="login-card-food">
        <div className="login-header-food">
          <h2 className="login-title-food">Login</h2>
          <p className="login-description-food">
            Login to your account to order delicious food!
          </p>
        </div>

        <div className="login-content-food">
          <form className="login-form-food" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email" className="login-label-food">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Your Email Address"
                className="login-input-food"
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="password" className="login-label-food">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="login-input-food"
              />
            </div>

            <div>
              <button type="submit" className="login-button-food">
                Login
              </button>
            </div>

            <div className="already">
              <Link to="/register" className="register-link-food">
                Don't Have an Account? Register
              </Link>
            </div>
          </form>

          <div className="login-social-food">
            <div className="login-separator-food">
              <span className="login-separator-text-food">
                Or continue with
              </span>
            </div>

            <div className="login-social-buttons-food">
              <button className="login-social-button-food login-social-google-food">
                Google
              </button>
              <button className="login-social-button-food login-social-facebook-food">
                Facebook
              </button>
              <button className="login-social-button-food login-social-github-food">
                Github
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
