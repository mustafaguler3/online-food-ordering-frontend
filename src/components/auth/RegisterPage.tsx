import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Paper, Box, Avatar, Typography, TextField, Button, Divider, Stack } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useError } from "../common/ErrorDisplay";
import authService from "../../services/authService";
import { toast } from "react-toastify";

const schema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  address: Yup.string().required("Address is required"),
});

type FormValues = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response: any = await authService.register(data);

      if (response.statusCode === 200) {
        toast.success(response.data.message, {
          position: "bottom-right",
          autoClose: 2000,
          theme: "colored",
        });
        reset(); 
        navigate("/login");
      } else {
        toast.error(response.data.message || "Registration failed", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "colored",
        });
        showError(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Register</Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            Create an account to order delicious food!
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          {/* Full Name */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Full Name"
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          {/* Phone Number */}
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Phone Number"
                margin="normal"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />

          {/* Address */}
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Address"
                margin="normal"
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />

          <ErrorDisplay />

          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>

          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
              Login
            </Link>
          </Typography>

          <Divider sx={{ my: 3 }}>Or continue with</Divider>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" startIcon={<GoogleIcon />} sx={{ textTransform: "none" }}>Google</Button>
            <Button variant="outlined" startIcon={<FacebookIcon />} sx={{ textTransform: "none" }}>Facebook</Button>
            <Button variant="outlined" startIcon={<GitHubIcon />} sx={{ textTransform: "none" }}>Github</Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;