import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import ApiService from "../../services/ApiService";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ApiService.getAllCategories();
        if (response.statusCode === 200) {
          setCategories(response.data);
        } else {
          showError(response.message);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    };

    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/menu?category=${categoryId}`);
  };

  return (
    <div className="home-page">
      <ErrorDisplay />
      <header className="home-hero-section">
        <div className="home-hero-content">
          <h1 className="home-hero-title">Discover Delicious Meals</h1>

          <p className="home-hero-subtitle">
            Order your favorite food online quickly and easily
          </p>

          <button
            className="home-explore-button"
            onClick={() => navigate("/menu")}
          >
            Explore Menu
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
            onClick={() => navigate("/menu")}
          >
            Order Now
          </button>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
