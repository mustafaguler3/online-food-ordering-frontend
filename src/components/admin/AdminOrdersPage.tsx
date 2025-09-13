import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import orderService from "../../services/orderService";
import { Order } from "../../models/Order";
import adminService from "../../services/adminService";
import { User } from "../../models/User";
import { toast } from "react-toastify";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import { DeliveryPerson } from "../../models/DeliveryPerson";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState();
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | null>(
    null
  );
  const [deliveryUsers, setDeliveryUsers] = useState<DeliveryPerson[]>([]);
  const [error, setError] = useState();

  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const response: any = await orderService.getOrders(
        filter === "all" ? null : filter
      );

      if (response.statusCode === 200) {
        setOrders(response.data.content);
      }
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const openAssignModal = (orderId: any) => {
    setSelectedOrderId(orderId);
    setOpenModal(true);
    adminService.getDeliveries().then((res) => setDeliveryUsers(res.data));
  };

  const handleViewOrder = (id: number) => {
    navigate(`/admin/orders/${id}`);
  };

  const assignOrderToDelivery = async (orderId: number, deliveryId: any) => {
    if (!selectedOrderId || !selectedDeliveryId) return;
    try {
      await adminService.manuelAssignDeliveryPerson(orderId, deliveryId);
      setError(null);
      toast.success("Order assigned to delivery successfully");
    } catch (err) {
      setError(err?.message);
      toast.error("Failed to assign delivery");
    }
  };

  if (error) {
    return (
      <>
      {error ? <h1 className="alert alert-warning">{error}</h1> : null}</>
    );
  }

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Orders Management
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>#{order.orderCode}</TableCell>
              <TableCell>
                {new Date(order.orderDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {order.orderItems.reduce((sum, i) => sum + i.quantity, 0)}
              </TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Chip
                  label={order.orderStatus}
                  color={
                    order.orderStatus === "DELIVERED"
                      ? "success"
                      : order.orderStatus === "ON_THE_WAY"
                      ? "info"
                      : "default"
                  }
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={order.paymentStatus
                  }
                  color={
                    order.paymentStatus === "COMPLETED"
                      ? "success"
                      : "warning"
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleViewOrder(order.id)}
                >
                  View
                </Button>
              </TableCell>
              <TableCell>
                {order.orderStatus !== "DELIVERED" && (
                  <Button
                    variant="contained"
                    onClick={() => openAssignModal(order.id)}
                  >
                    Assign to Delivery
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Assign Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>
          Assign Delivery Person
          <IconButton
            aria-label="close"
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Select
            value={selectedDeliveryId ?? ""}
            onChange={(e) => setSelectedDeliveryId(Number(e.target.value))}
            fullWidth
          >
            {deliveryUsers.map((user) => (
              <MenuItem
                key={user.id}
                value={user.id}
                disabled={user.hasActiveOrder}
              >
                <CircleIcon
                  fontSize="small"
                  sx={{ color: user.hasActiveOrder ? "red" : "green", mr: 1 }}
                />
                {user.user.name} {user.hasActiveOrder ? "(Busy)" : "(Available)"}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={() =>
              assignOrderToDelivery(selectedOrderId, selectedDeliveryId)
            }
            disabled={!selectedDeliveryId}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AdminOrdersPage;
