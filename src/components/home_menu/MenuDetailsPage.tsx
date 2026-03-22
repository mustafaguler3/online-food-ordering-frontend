/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Rating,
  TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import menuService from "../../services/menuService";
import { AuthHelper } from "../../helpers/AuthHelper";
import { useError } from "../common/ErrorDisplay";
import { cartService } from "../../services/cartService";
import reviewService from "../../services/reviewService";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { Menu } from "../../models/Menu";

const MenuDetailsPage = () => {
  const { id } = useParams();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const [menu, setMenu] = useState<Menu>(null);
  const [setAverageRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [ setCartSuccess] = useState(false);

  const isAuthenticated = AuthHelper.isAuthenticated();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response: any = await menuService.getMenuById(id);
        if (response.statusCode === 200) {
          setMenu(response.data);
          const ratingResponse: any =
            await reviewService.getMenuAverageOverallReview(id);

          console.log("average " + ratingResponse);
          if (ratingResponse.statusCode === 200) {
            setAverageRating(ratingResponse);
            console.log("average " + ratingResponse.data.averageRating);
          }
        } else {
          showError(response);
        }
      } catch (error: any) {
        showError(error.response?.data?.message || error.message);
      }
    };
    fetchMenu();
  }, [id]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showError("Please login to continue.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    try {
      const response: any = await cartService.addItemToCart({
        menuId: menu.id,
        quantity,
      });
      if (response.statusCode === 200) {
        setCartSuccess(true);
        await fetchCart();
        toast.success(`${menu.name} added successfully!`, {
          position: "bottom-right",
          autoClose: 2000,
          theme: "colored",
        });
        setTimeout(() => setCartSuccess(false), 3000);
      } else {
        showError(response.message);
      }
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  if (!menu) return <Container sx={{ mt: 4 }}>Loading...</Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <ErrorDisplay />
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        &larr; Back to Menu
      </Button>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* Menu Image */}
        <Box sx={{ flex: 1 }}>
          <img
            src={`http://localhost:8081/uploads/menu/${menu.imageUrl}`}
            alt={menu.name}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Box>

        {/* Menu Info */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {menu.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {menu.description}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" color="primary">
              ${menu.price.toFixed(2)}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating
                name="average-rating"
                value={menu.averageRating} // backend’den gelen double
                precision={0.1} // 0.1 ile daha hassas yarım yıldız
                readOnly
                sx={{ color: "#FFD700" }} // sarı renk
              />
              <Typography variant="body2">
                {menu.averageRating.toFixed(1)}
              </Typography>
            </Stack>

            <Typography variant="body2">
              ({menu.reviews?.length || 0} reviews)
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <IconButton onClick={decrementQuantity}>
              <RemoveIcon />
            </IconButton>
            <TextField
              value={quantity}
              size="small"
              inputProps={{ readOnly: true, style: { textAlign: "center" } }}
              sx={{ width: 60 }}
            />
            <IconButton onClick={incrementQuantity}>
              <AddIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </Stack>
        </Box>
      </Stack>

      {/* Reviews */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        {menu.reviews && menu.reviews.length > 0 ? (
          menu.reviews.map((review: any) => (
            <Box
              key={review.id}
              sx={{
                border: "1px solid #e0e0e0",
                p: 2,
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2">{review.userName}</Typography>
                <Typography variant="caption">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
              <Rating value={review.rating} readOnly />
              <Typography variant="body2">{review.comment}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No reviews yet. Be the first to review!</Typography>
        )}
      </Box>
    </Container>
  );
};

export default MenuDetailsPage;
