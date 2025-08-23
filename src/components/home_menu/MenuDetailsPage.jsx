import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { useError } from "../common/ErrorDisplay"; // import custom error hook

const MenuDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartSuccess, setCartSuccess] = useState(false);

  const isAuthenticated = ApiService.isAuthenticated();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await ApiService.getMenuById(id);
        if (response.statusCode === 200) {
          setMenu(response.data);

          // Fetch average rating
          const ratingResponse = await ApiService.getMenuAverageOverallReview(
            id
          );
          if (ratingResponse.statusCode === 200) {
            setAverageRating(ratingResponse.data);
          }
        } else {
          showError(response.message);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    };

    fetchMenu();
  }, [id]);

  const handleBackToMenu = () => {
    navigate(-1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showError(
        "Please login to continue, If you don't have an acount do well to register"
      );
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      return;
    }
    setCartSuccess(false);
    try {
      const response = await ApiService.addItemToCart({
        menuId: menu.id,
        quantity: quantity,
      });

      if (response.statusCode === 200) {
        setCartSuccess(true);
        setTimeout(() => setCartSuccess(false), 4000);
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // if (!menu) {
  //     return (
  //         <div className="menu-details-not-found">
  //             <p>Menu item not found</p>
  //             <button onClick={handleBackToMenu} className="back-button">
  //                 Back to Menu
  //             </button>
  //         </div>
  //     );
  // }

  if (menu) {
    return (
      <div className="menu-details-container">
        <ErrorDisplay />
        <button onClick={handleBackToMenu} className="back-button">
          &larr; Back to Menu
        </button>

        <div className="menu-item-header">
          <div className="menu-item-image-container">
            <img
              src={`http://localhost:8080/`+menu.imageUrl}
              alt={menu.name}
              className="menu-item-image-detail"
            />
          </div>
          <div className="menu-item-info">
            <h1 className="menu-item-name">{menu.name}</h1>
            <p className="menu-item-description">{menu.description}</p>
            <div className="menu-item-price-rating">
              <span className="price">${menu.price.toFixed(2)}</span>
              <div className="rating">
                <span className="rating-value">{averageRating.toFixed(1)}</span>
                <span className="rating-star">★</span>
                <span className="rating-count">
                  ({menu.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <button
                  onClick={decrementQuantity}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button onClick={incrementQuantity} className="quantity-btn">
                  +
                </button>
              </div>
              <button onClick={handleAddToCart} className="add-to-cart-btn">
                {"Add to Cart"}
              </button>
              {cartSuccess && (
                <div className="cart-success-message">
                  Added to cart successfully!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h2 className="reviews-title">Customer Reviews</h2>

          {menu.reviews && menu.reviews.length > 0 ? (
            <div className="reviews-list">
              {menu.reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-user">{review.userName}</span>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(10 - review.rating)}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </div>
    );
  }
};

export default MenuDetailsPage;
