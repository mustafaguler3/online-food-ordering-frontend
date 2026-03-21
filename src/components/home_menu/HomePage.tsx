/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import categoryService from "../../services/categoryService";
import { Category } from "../../models/Category";
import { useError } from "../common/ErrorDisplay";
import { Restaurant } from "../../models/Restaurant";
import restaurantService from "../../services/restaurantService";
import "./HomePage.css"

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants,setRestaurants] = useState<Restaurant[]>([]);

  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchData = async () => {
    try {
      const catRes: any = await categoryService.getCategories();
      if (catRes.statusCode === 200) setCategories(catRes.data);

      const restRes: any = await restaurantService.getRestaurants();
      if (restRes.statusCode === 200) setRestaurants(restRes.data);
    } catch (error: any) {
      showError(error.response?.data?.message || error.message);
    }
  };
  fetchData()
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/menus?categoryId=${categoryId}`);
  };
  const handleRestaurantClick = (restaurantId: number) => {
    navigate(`/menus?restaurantId=${restaurantId}`);
  };

  return (
    <div className="home-page">
      <ErrorDisplay />
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Discover Delicious Meals</h1>
          <p className="hero-subtitle">
            Order your favorite food online quickly and easily
          </p>
          <button className="hero-button" onClick={() => navigate("/menus")}>
            🍴 Explore Menu
          </button>
        </div>
      </header>

      <section className="home-featured-categories">
        <h2 className="home-section-title">Featured Categories</h2>
        <div className="home-category-carousel">
          {categories.map((category) => (
            <div
              key={category.id}
              className="home-category-card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <h3 className="home-category-name">{category.name}</h3>
              <p className="home-category-description">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-call-to-action">
        <div className="home-cta-content">
          <h2 className="home-cta-title">Ready to Order?</h2>
          <p className="home-cta-text">
            Browse our menu and place your order now!
          </p>
          <button
            className="home-order-now-button"
            onClick={() => navigate("/menus")}
          >
            Order Now
          </button>
        </div>
      </section>

    </div>
  );
};
export default HomePage;
