import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Avatar,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useError } from "../common/ErrorDisplay";
import { AuthHelper } from "../../helpers/AuthHelper";
import authService from "../../services/authService";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";

const LoginPage = () => {
  const { fetchUser } = useUser();
  const { fetchCart } = useCart();
  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();
  //const { state } = useLocation();
  //const redirectPath = state?.from?.pathname || "/home";

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showError("Email and password are required.");
      return;
    }

    try {
      const response: any = await authService.login(formData);

      if (response.statusCode === 200) {
        AuthHelper.saveToken(response.data.token);
        AuthHelper.saveRole(response.data.roles);
        const roles = response.data.roles;

        if (roles.includes("DELIVERY")) {
          //window.location.href = "/delivery";
          navigate("/delivery", {replace: true})
          window.location.reload();
        }else if (roles.includes("ADMIN")) {
          navigate("/admin", {replace : true})
          window.location.reload();
        }else {
          navigate("/home", { replace: true });
          window.location.reload();
        }
        await fetchUser();
        await fetchCart();
      } else {
        showError(response.data.message || "Beklenmeyen hata");
      }
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <ErrorDisplay />
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Login to your account to order delicious food!
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>

          <Typography variant="body2" align="center">
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Register
            </Link>
          </Typography>

          <Divider sx={{ my: 3 }}>Or continue with</Divider>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ textTransform: "none" }}
            >
              Google
            </Button>
            <Button
              variant="outlined"
              startIcon={<FacebookIcon />}
              sx={{ textTransform: "none" }}
            >
              Facebook
            </Button>
            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
              sx={{ textTransform: "none" }}
            >
              Github
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
