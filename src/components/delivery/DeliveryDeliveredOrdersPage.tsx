import { useEffect, useState } from "react";
import { Order } from "../../models/Order";
import deliveryService from "../../services/deliveryService";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Divider,
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CreditCardIcon from "@mui/icons-material/CreditCard";
const DeliveryDeliveredOrdersPage = () => {
  const [deliveredOrder, setDeliveredOrder] = useState<Order[]>([]);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const response = await deliveryService.deliveredOrders();
        if (response.statusCode === 200) {
          setDeliveredOrder(response.data);
          setError(null);
        } else {
          setError(response?.message);
        }
      } catch (err) {
        setError(err?.message);
      }
    };
    fetchDeliveredOrders();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📦 Delivered orders
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {deliveredOrder.length === 0 && !error && (
        <Typography color="text.secondary">No delivered orders</Typography>
      )}

      <Grid spacing={3} marginTop={2}>
        {deliveredOrder.map((order) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={order.id}
            component={"div" as any}
          >
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold" color="white">
                    #{order.orderCode}
                  </Typography>
                }
                action={
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Delivered"
                    color="success"
                    size="small"
                  />
                }
                sx={{
                  background: "linear-gradient(90deg, #4caf50, #81c784)",
                  color: "white",
                  py: 2,
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography>Username: {order.user?.name}</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Typography>
                    Order Date:{" "}
                    {new Date(order.orderDate).toLocaleString("tr-TR")}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CreditCardIcon fontSize="small" color="action" />
                  <Typography fontWeight="bold">
                    Total amount: {order.totalAmount} ₺
                  </Typography>
                  <Chip
                    label={order.paymentStatus}
                    color={order.paymentStatus === "PAID" ? "success" : "error"}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Order Summary</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {order.orderItems.map((item) => (
                      <Typography
                        key={item.id}
                        variant="body2"
                        color="text.secondary"
                      >
                        • {item?.menu.name} × {item.quantity}
                      </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DeliveryDeliveredOrdersPage;
