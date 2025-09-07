import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import restaurantService from "../../services/restaurantService";
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Restaurant } from "../../models/Restaurant";
import { Menu } from "../../models/Menu";

const RestaurantDetailPage = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response: any = await restaurantService.getRestaurantById(
          restaurantId
        );
        if (response.statusCode === 200) {
          setRestaurant(response.data);
          setError(null);
        } else {
          setError(response.message || "Failed to fetch restaurant");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

  if (error)
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );

  if (!restaurant) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box
        sx={{
          width: "100%",
          height: { xs: 300, md: 400 },
          position: "relative",
          mb: 8,
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${
              restaurant.imageUrl || "/default-restaurant.jpg"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)", 
          }}
        />

        {/* Logo */}
        <Box
          sx={{
            position: "absolute",
            top: "80%",
            left: 25,
            transform: "translateY(-50%)",
            width: { xs: 80, md: 120 },
            height: { xs: 80, md: 120 },
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid white",
            boxShadow: 3,
            zIndex: 10,
            backgroundColor: "white",
          }}
        >
          <CardMedia
            component="img"
            src={restaurant.logoUrl || "/default-logo.jpg"}
            alt={`${restaurant.name} logo`}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* Restaurant bilgisi */}
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            left: { xs: 24, md: 160 },
            color: "white",
            zIndex: 10,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            {restaurant.name}
          </Typography>
          <Typography variant="body1">{restaurant.address}</Typography>
          <Typography variant="body1">Phone: {restaurant.phone}</Typography>
        </Box>
      </Box>

      {/* Menu Items */}
      <Typography variant="h5" gutterBottom>
        Menu
      </Typography>
      <Grid container spacing={3}>
        {restaurant.menus.map((menu: Menu) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={menu.id}
            component={"div" as any}
          >
            <Card
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.03)" },
              }}
              onClick={() => console.log(`Go to menu ${menu.id}`)}
            >
              <CardMedia
                component="img"
                height="180"
                image={menu.imageUrl || "/default-menu.jpg"}
                alt={menu.name}
              />
              <CardContent>
                <Typography variant="h6">{menu.name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {menu.description}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  ${menu?.price ? menu?.price.toFixed(2) : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RestaurantDetailPage;
