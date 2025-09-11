import { useEffect, useState } from "react";
import deliveryService from "../../services/deliveryService";

import { Order } from "../../models/Order";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Box,
  Chip,
  Button,
} from "@mui/material";

const DeliveryAssignedOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await deliveryService.assignedOrders();
        if (response.statusCode === 200) {
          setOrders(response.data);
          setError(null);
        } else {
          setError(response?.message || "Unexpected error occurred");
        }
      } catch (err) {
        setError(err?.message);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: any) => {
    try {
      const response = await deliveryService.updateOrderStatus(
        orderId,
        newStatus
      );
      if (response.statusCode === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, orderStatus: newStatus } : o
          )
        );
        if (newStatus === "ON_THE_WAY") {
          await deliveryService.locationStart(orderId)
        }
      } else {
        setError(response.message || "Failed to update status");
      }
    } catch (error) {
      setError(error?.message);
    }
  };

  if (!orders) {
    return (
      <h3 className="text-center mt-10 text-gray-500">
        🚚 No assigned orders yet
      </h3>
    );
  }

  return (
    <Grid  spacing={3} sx={{ p: 4 }}>
      {error ? <h1 className="alert alert-danger">{error}</h1> : ""}

      {orders.map((order) => (
        <Grid item xs={12} key={order.id} component={"div" as any}>
          <Card sx={{ borderRadius: 3, boxShadow: 4, p: 2 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h5" fontWeight="bold">
                  Order #{order.orderCode}
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip label={order.orderStatus} color={ order.orderStatus === "DELIVERED" ? "success" : "primary" } />
                  <Chip label={order.paymentStatus} color="secondary" />
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Date: {new Date(order.orderDate).toLocaleString()}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* User Info */}
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar
                  src={order.user.profileUrl}
                  alt={order.user.name}
                  sx={{ width: 70, height: 70 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Customer Info
                  </Typography>
                  <Typography>
                    <strong>Name:</strong> {order.user.name}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {order.user.email}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {order.user.phoneNumber}
                  </Typography>
                  <Typography>
                    <strong>Address:</strong> {order.user.address}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Delivery Person */}
              <Box mb={2}>
                <Typography>
                  <strong>Delivery Name:</strong> 
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Order Items */}
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Items
              </Typography>
              {order.orderItems.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                  sx={{
                    p: 1,
                    border: "1px solid #eee",
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={item.menu.imageUrl}
                      alt={item.menu.name}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                    <Typography>
                      {item.menu.name} x{item.quantity}
                    </Typography>
                  </Box>
                  <Typography fontWeight="bold">${item.subtotal}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Total */}
              <Typography variant="h6" fontWeight="bold">
                Total: ${order.totalAmount}
              </Typography>
            </CardContent>
          </Card>
          <Divider />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            {order.orderStatus === "ASSIGNED" && (
              <Button 
              variant="contained"
              color="primary"
              onClick={() => handleStatusChange(order.id,"ON_THE_WAY")}>
                Start Delivery
              </Button>
            )}

            {order.orderStatus === "ON_THE_WAY" && (
              <Button
              variant="contained"
              color="success"
              onClick={() => handleStatusChange(order.id,"DELIVERED")}>
                Mark as Delivered
              </Button>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default DeliveryAssignedOrdersPage;
