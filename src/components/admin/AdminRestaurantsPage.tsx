import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import restaurantService from "../../services/restaurantService";
import { Restaurant } from "../../models/Restaurant";

const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response: any = await restaurantService.getRestaurants();
        if (response.statusCode === 200) {
          setRestaurants(response.data);
          setError(null);
        } else {
          setError(response.message || "Failed to fetch restaurants");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    };
    fetchRestaurants();
  }, []);

  if (restaurants.length === 0) {
    return <h1 className="alert alert-danger">No records</h1>;
  }
  
  return (
    <div className="admin-page">
      <h1 className="page-title">Restaurants</h1>
      {error && <div className="alert-error">{error}</div>}

      <div className="table-wrapper">
        <table className="restaurants-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>
                  <img
                    src={restaurant.logoUrl}
                    alt={restaurant.name}
                    className="restaurant-logo"
                  />
                </td>
                <td>{restaurant.name}</td>
                <td>{restaurant.address}</td>
                <td>{restaurant.phone}</td>
                <td>
                  {restaurant.rating ? restaurant.rating.toFixed(1) : 0} ★
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/admin/restaurants/edit/${restaurant.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRestaurantsPage;
