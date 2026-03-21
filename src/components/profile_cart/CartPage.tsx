import React, { useEffect, useState } from "react";
import { Container, Paper, Box, Typography, Button, Grid, Divider, IconButton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useError } from "../common/ErrorDisplay";
import { useCart } from "../../context/CartContext";
import { cartService } from "../../services/cartService";
import orderService from "../../services/orderService";

const CartPage = () => {
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();
  const { fetchCart, cart } = useCart();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      const response: any = await orderService.placeOrder();
      if (response.statusCode === 200) {
        setMessage(response.message);
        setTimeout(() => {
          setMessage(null);
          fetchCart();
          navigate("/my-order-history");
        }, 3000);
      }
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleIncrement = async (menuId: number) => {
    try {
      const response: any = await cartService.incrementItem(menuId);
      if (response.statusCode === 200) fetchCart();
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleDecrement = async (menuId: number) => {
    try {
      const response: any = await cartService.decrementItem(menuId);
      if (response.statusCode === 200) fetchCart();
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleRemove = async (cartItemId: number) => {
    try {
      const response: any = await cartService.removeItem(cartItemId);
      if (response.statusCode === 200) fetchCart();
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  if (!cart || cart.cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Browse our menu to add delicious items to your cart
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate("/menu")}>
            Browse Menu
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <ErrorDisplay />
      {message && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: "#d0f0c0", textAlign: "center" }}>
          <Typography color="green">{message}</Typography>
        </Paper>
      )}

      <Typography variant="h4" gutterBottom>
        Your Shopping Cart
      </Typography>

      <Stack spacing={2}>
        {cart.cartItems.map((item: any) => (
          <Paper key={item.id} sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
            <Box
              component="img"
              src={`http://localhost:8081/uploads/menu/`+item.menu.imageUrl}
              alt={item.menu.name}
              sx={{ width: 100, height: 100, borderRadius: 1, objectFit: "cover" }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{item.menu.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.menu.description}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                ${item.pricePerUnit.toFixed(2)} each
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <IconButton
                  color="primary"
                  onClick={() => handleDecrement(item.menu.id)}
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton color="primary" onClick={() => handleIncrement(item.menu.id)}>
                  <AddIcon />
                </IconButton>
              </Stack>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6">${item.subtotal.toFixed(2)}</Typography>
              <IconButton color="error" onClick={() => handleRemove(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container justifyContent="space-between">
          <Typography variant="h6">Subtotal:</Typography>
          <Typography variant="h6">${cart.totalAmount.toFixed(2)}</Typography>
        </Grid>
        <Divider sx={{ my: 1 }} />
        <Grid container justifyContent="space-between">
          <Typography variant="h5">Total:</Typography>
          <Typography variant="h5">${cart.totalAmount.toFixed(2)}</Typography>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
      </Paper>
    </Container>
  );
};

export default CartPage;