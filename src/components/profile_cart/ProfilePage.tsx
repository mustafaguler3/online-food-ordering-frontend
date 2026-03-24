/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import { useError } from "../common/ErrorDisplay";
import userService from "../../services/userService";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response: any = await userService.myProfile();
        if (response.statusCode === 200) {
          setUser(response.data);
        }
      } catch (error: any) {
        showError(error.response?.data?.message || error.message);
      }
    };
    fetchUserProfile();
  }, []);

  const handleEditProfile = () => navigate("/update");
  const handleViewOrders = () => navigate("/my-order-history");

  if (!user) return <Container sx={{ mt: 4 }}>Loading...</Container>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <ErrorDisplay />
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Avatar & Name */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            src={
              user.profileUrl
                ? `http://localhost:8081${user.profileUrl}`
                : undefined
            }
            sx={{ width: 100, height: 100, mb: 2 }}
          >
            {!user.profileUrl && user.name.substring(0, 2).toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography
            variant="body2"
            style={{ color: user.active ? "green" : "gray" }}
          >
            {user.active ? "Active" : "Inactive"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Info */}
        <Stack spacing={2} mb={3}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="medium">
              Email:
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="medium">
              Phone:
            </Typography>
            <Typography variant="body1">{user.phoneNumber}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="medium">
              Address:
            </Typography>
            <Typography variant="body1">{user.address}</Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
          {user.role === "USER" && (
            <Button variant="outlined" color="primary" onClick={handleViewOrders}>
            View Orders
          </Button>)}
        </Stack>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
