import { useEffect, useState } from "react";
import { Restaurant } from "../../models/Restaurant";
import restaurantService from "../../services/restaurantService";
import { useNavigate } from "react-router-dom";
import "../home_menu/RestaurantsPage.css"

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getRestaurants();
        if (response.statusCode === 200) {
          setRestaurants(response.data);
          setError(null);
        }
      } catch (err) {
        console.log(err.message);
        setError(err?.message);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="restaurants-page">
      <h1 className="restaurants-title">Our Restaurants</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="restaurant-card"
            onClick={() => navigate(`/restaurants/${restaurant.id}`)}
          >
            <div className="restaurant-image-container">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="restaurant-image"
              />
              <img
                src={restaurant.logoUrl}
                alt={`${restaurant.name} logo`}
                className="restaurant-logo"
              />
            </div>
            <div className="restaurant-info">
              <h2 className="restaurant-name">{restaurant.name}</h2>
              <p className="restaurant-address">{restaurant.address}</p>
              <p className="restaurant-phone">📞 {restaurant.phone}</p>
              <p className="restaurant-rating">⭐ {restaurant.rating ? restaurant.rating.toFixed(1): 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default RestaurantsPage;
