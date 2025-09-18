import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
  Avatar,
  Skeleton,
  Chip,
  Box,
} from "@mui/material";
import orderService from "../../services/orderService";
import { formatDate } from "../../utils/dateUtils";
import { Order } from "../../models/Order";
import OrderTrackingPage from "./OrderTrackingPage";

const OrderDetail = () => {
  const { id } = useParams<{ id: any }>();
  const [order, setOrder] = useState<Order>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        console.error("Order fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return (
      <Box p={4}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );

  if (!order) return <Typography variant="h6">Order not found</Typography>;

  // Order status için renk fonksiyonu
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning"; // turuncu
      case "ON_THE_WAY":
        return "info"; // mavi
      case "DELIVERED":
        return "success"; // yeşil
      case "CANCELLED":
        return "error"; // kırmızı
      default:
        return "default"; // gri
    }
  };

  // Payment status için renk fonksiyonu
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "error";
      default:
        return "default";
    }
  };
  return (
    <Box p={4}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Order Details #{order.id}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Order Summary */}
          <Box mb={3}>
            <Typography variant="body1" gutterBottom>
              <strong>Date:</strong> {formatDate(order.orderDate.toString())}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Status:</strong>{" "}
              <Chip
                label={order.orderStatus}
                color={getOrderStatusColor(order.orderStatus)}
                size="small"
              />
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              <strong>Payment:</strong>
              <Chip
                label={order.paymentStatus}
                color={getPaymentStatusColor(order.paymentStatus)}
                size="small"
              />
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Order Items */}
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {order.orderItems.map((item: any) => (
              <Grid
                item
                xs={12}
                key={item.id}
                component={"div" as any}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  pb: 2,
                }}
              >
                <Avatar
                  src={item.menu.imageUrl}
                  alt={item.menu.name}
                  sx={{ width: 70, height: 70, borderRadius: 2, mr: 2 }}
                />
                <Box flexGrow={1}>
                  <Typography fontWeight="medium">{item.menu.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${item.pricePerUnit.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Subtotal: ${item.subtotal.toFixed(2)}
                  </Typography>
                </Box>
                {order.orderStatus === "DELIVERED" && (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{ ml: 2 }}
                    onClick={() =>
                      console.log("Leave review", order.id, item.menu.id)
                    }
                  >
                    Leave Review
                  </Button>
                )}
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Order Tracking */}
          <Typography variant="h6" gutterBottom>
            Delivery Tracking
          </Typography>
          {order.deliveryPerson ? (
            <>
              <OrderTrackingPage orderId={order.id} />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Delivery person not assigned yet.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetail;
